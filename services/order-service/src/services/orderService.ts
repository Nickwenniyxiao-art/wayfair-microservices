import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import getDatabase from '../db/index.js';
import { orders, orderItems, orderHistory } from '../db/schema.js';
import logger from '../middleware/logger.js';

export class OrderService {
  /**
   * 创建订单
   */
  async createOrder(data: {
    userId: string;
    items: Array<{
      productId: string;
      skuId: string;
      productName: string;
      quantity: number;
      price: number;
      attributes?: Record<string, string>;
    }>;
    shippingAddress: Record<string, any>;
    billingAddress: Record<string, any>;
    shippingAmount: number;
    taxAmount: number;
    discountAmount: number;
  }) {
    try {
      const db = getDatabase();

      const orderId = uuidv4();
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // 计算总金额
      const itemsTotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalAmount = itemsTotal + data.shippingAmount + data.taxAmount - data.discountAmount;

      // 创建订单
      await db.insert(orders).values({
        id: orderId,
        userId: data.userId,
        orderNumber,
        totalAmount,
        shippingAmount: data.shippingAmount,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
      });

      // 添加订单项目
      for (const item of data.items) {
        await db.insert(orderItems).values({
          id: uuidv4(),
          orderId,
          productId: item.productId,
          skuId: item.skuId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          attributes: item.attributes,
        });
      }

      // 添加订单历史
      await db.insert(orderHistory).values({
        id: uuidv4(),
        orderId,
        status: 'pending',
        comment: 'Order created',
      });

      logger.info(`Order created: ${orderNumber}`);
      return { orderId, orderNumber, totalAmount };
    } catch (error) {
      logger.error('Failed to create order:', error);
      throw error;
    }
  }

  /**
   * 获取订单详情
   */
  async getOrder(orderId: string) {
    try {
      const db = getDatabase();

      const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
          items: true,
          history: true,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error('Failed to get order:', error);
      throw error;
    }
  }

  /**
   * 获取用户订单列表
   */
  async getUserOrders(userId: string, limit = 10, offset = 0) {
    try {
      const db = getDatabase();

      const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, userId),
        orderBy: desc(orders.createdAt),
        limit,
        offset,
        with: {
          items: true,
        },
      });

      return userOrders;
    } catch (error) {
      logger.error('Failed to get user orders:', error);
      throw error;
    }
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(orderId: string, status: string, comment?: string) {
    try {
      const db = getDatabase();

      await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));

      // 添加订单历史
      await db.insert(orderHistory).values({
        id: uuidv4(),
        orderId,
        status,
        comment,
      });

      logger.info(`Order status updated: ${orderId} -> ${status}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to update order status:', error);
      throw error;
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: string, reason?: string) {
    try {
      const db = getDatabase();

      const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
        throw new Error('Cannot cancel order in current status');
      }

      await this.updateOrderStatus(orderId, 'cancelled', reason);

      logger.info(`Order cancelled: ${orderId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to cancel order:', error);
      throw error;
    }
  }

  /**
   * 获取订单历史
   */
  async getOrderHistory(orderId: string) {
    try {
      const db = getDatabase();

      const history = await db.query.orderHistory.findMany({
        where: eq(orderHistory.orderId, orderId),
        orderBy: desc(orderHistory.createdAt),
      });

      return history;
    } catch (error) {
      logger.error('Failed to get order history:', error);
      throw error;
    }
  }
}

export default new OrderService();
