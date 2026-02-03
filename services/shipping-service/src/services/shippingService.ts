import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import getDatabase from '../db/index.js';
import { shipments, shipmentHistory, shippingMethods, shippingZones } from '../db/schema.js';
import logger from '../middleware/logger.js';

export class ShippingService {
  /**
   * 创建配送单
   */
  async createShipment(data: {
    orderId: string;
    userId: string;
    shippingAddress: {
      recipientName: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    shippingMethodId: string;
    notes?: string;
  }) {
    try {
      const db = getDatabase();

      const shipmentId = uuidv4();

      // 获取配送方式
      const methodRecords = await db.select().from(shippingMethods).where(eq(shippingMethods.id, data.shippingMethodId)).limit(1);
      if (!methodRecords || methodRecords.length === 0) {
        throw new Error('Shipping method not found');
      }

      const method = methodRecords[0];

      // 计算配送费用
      let shippingCost = typeof method.basePrice === 'string' ? parseFloat(method.basePrice) : method.basePrice;

      // 根据地区调整费用
      const zoneRecords = await db.select().from(shippingZones).where(
        and(
          eq(shippingZones.country, data.shippingAddress.country),
          eq(shippingZones.state, data.shippingAddress.state)
        )
      ).limit(1);

      if (zoneRecords && zoneRecords.length > 0) {
        const zone = zoneRecords[0];
        const multiplier = typeof zone.multiplier === 'string' ? parseFloat(zone.multiplier) : zone.multiplier;
        shippingCost = shippingCost * multiplier;
      }

      // 创建配送单
      await db.insert(shipments).values({
        id: shipmentId,
        orderId: data.orderId,
        userId: data.userId,
        status: 'pending',
        carrier: method.carrier,
        shippingAddress: data.shippingAddress,
        weight: String(data.weight),
        dimensions: data.dimensions,
        shippingCost: String(shippingCost),
        notes: data.notes,
      });

      // 记录历史
      await db.insert(shipmentHistory).values({
        id: uuidv4(),
        shipmentId,
        status: 'pending',
        message: 'Shipment created',
      });

      logger.info(`Shipment created: ${shipmentId}`);

      return {
        shipmentId,
        status: 'pending',
        shippingCost,
        carrier: method.carrier,
        estimatedDelivery: method.estimatedDays,
      };
    } catch (error) {
      logger.error('Failed to create shipment:', error);
      throw error;
    }
  }

  /**
   * 更新配送状态
   */
  async updateShipmentStatus(data: {
    shipmentId: string;
    status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
    trackingNumber?: string;
    location?: string;
    message?: string;
  }) {
    try {
      const db = getDatabase();

      // 获取配送单
      const shipmentRecords = await db.select().from(shipments).where(eq(shipments.id, data.shipmentId)).limit(1);

      if (!shipmentRecords || shipmentRecords.length === 0) {
        throw new Error('Shipment not found');
      }

      const shipment = shipmentRecords[0];

      // 更新配送单
      const updateData: any = { status: data.status };
      if (data.trackingNumber) {
        updateData.trackingNumber = data.trackingNumber;
      }
      if (data.status === 'delivered') {
        updateData.actualDelivery = new Date();
      }

      await db.update(shipments).set(updateData).where(eq(shipments.id, data.shipmentId));

      // 记录历史
      await db.insert(shipmentHistory).values({
        id: uuidv4(),
        shipmentId: data.shipmentId,
        status: data.status,
        location: data.location,
        message: data.message,
      });

      logger.info(`Shipment status updated: ${data.shipmentId} -> ${data.status}`);

      return { success: true, status: data.status };
    } catch (error) {
      logger.error('Failed to update shipment status:', error);
      throw error;
    }
  }

  /**
   * 获取配送详情
   */
  async getShipment(shipmentId: string) {
    try {
      const db = getDatabase();

      const shipmentRecords = await db.select().from(shipments).where(eq(shipments.id, shipmentId)).limit(1);

      if (!shipmentRecords || shipmentRecords.length === 0) {
        throw new Error('Shipment not found');
      }

      return shipmentRecords[0];
    } catch (error) {
      logger.error('Failed to get shipment:', error);
      throw error;
    }
  }

  /**
   * 获取订单的配送单
   */
  async getOrderShipments(orderId: string) {
    try {
      const db = getDatabase();

      const orderShipments = await db.select().from(shipments).where(eq(shipments.orderId, orderId)).orderBy(desc(shipments.createdAt));

      return orderShipments;
    } catch (error) {
      logger.error('Failed to get order shipments:', error);
      throw error;
    }
  }

  /**
   * 获取配送历史
   */
  async getShipmentHistory(shipmentId: string) {
    try {
      const db = getDatabase();

      const history = await db.select().from(shipmentHistory).where(eq(shipmentHistory.shipmentId, shipmentId)).orderBy(desc(shipmentHistory.timestamp));

      return history;
    } catch (error) {
      logger.error('Failed to get shipment history:', error);
      throw error;
    }
  }

  /**
   * 获取所有配送方式
   */
  async getShippingMethods() {
    try {
      const db = getDatabase();

      const methods = await db.select().from(shippingMethods).where(eq(shippingMethods.isActive, '1'));

      return methods;
    } catch (error) {
      logger.error('Failed to get shipping methods:', error);
      throw error;
    }
  }

  /**
   * 计算配送费用
   */
  async calculateShippingCost(data: {
    weight: number;
    country: string;
    state: string;
    shippingMethodId: string;
  }) {
    try {
      const db = getDatabase();

      // 获取配送方式
      const methodRecords = await db.select().from(shippingMethods).where(eq(shippingMethods.id, data.shippingMethodId)).limit(1);

      if (!methodRecords || methodRecords.length === 0) {
        throw new Error('Shipping method not found');
      }

      const method = methodRecords[0];
      let cost = typeof method.basePrice === 'string' ? parseFloat(method.basePrice) : method.basePrice;

      // 根据地区调整费用
      const zoneRecords = await db.select().from(shippingZones).where(
        and(
          eq(shippingZones.country, data.country),
          eq(shippingZones.state, data.state)
        )
      ).limit(1);

      if (zoneRecords && zoneRecords.length > 0) {
        const zone = zoneRecords[0];
        const multiplier = typeof zone.multiplier === 'string' ? parseFloat(zone.multiplier) : zone.multiplier;
        cost = cost * multiplier;
      }

      // 根据重量调整费用
      const weightCost = data.weight * 0.5; // 每磅 $0.50
      cost = cost + weightCost;

      return { cost, carrier: method.carrier, estimatedDays: method.estimatedDays };
    } catch (error) {
      logger.error('Failed to calculate shipping cost:', error);
      throw error;
    }
  }

  /**
   * 获取用户的所有配送单
   */
  async getUserShipments(userId: string) {
    try {
      const db = getDatabase();

      const userShipments = await db.select().from(shipments).where(eq(shipments.userId, userId)).orderBy(desc(shipments.createdAt));

      return userShipments;
    } catch (error) {
      logger.error('Failed to get user shipments:', error);
      throw error;
    }
  }
}

export default new ShippingService();
