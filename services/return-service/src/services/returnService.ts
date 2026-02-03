import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import getDatabase from '../db/index.js';
import { returns, returnHistory, returnReasons, returnPolicies } from '../db/schema.js';
import logger from '../middleware/logger.js';

export class ReturnService {
  /**
   * 创建退货请求
   */
  async createReturnRequest(data: {
    orderId: string;
    userId: string;
    reason: string;
    description?: string;
    refundAmount: number;
    images?: string[];
    notes?: string;
  }) {
    try {
      const db = getDatabase();

      const returnId = uuidv4();

      // 创建退货记录
      await db.insert(returns).values({
        id: returnId,
        orderId: data.orderId,
        userId: data.userId,
        status: 'requested',
        reason: data.reason,
        description: data.description,
        refundAmount: String(data.refundAmount),
        refundStatus: 'pending',
        images: data.images,
        notes: data.notes,
      });

      // 记录历史
      await db.insert(returnHistory).values({
        id: uuidv4(),
        returnId,
        status: 'requested',
        message: 'Return request created',
      });

      logger.info(`Return request created: ${returnId}`);

      return {
        returnId,
        status: 'requested',
        refundAmount: data.refundAmount,
      };
    } catch (error) {
      logger.error('Failed to create return request:', error);
      throw error;
    }
  }

  /**
   * 批准退货请求
   */
  async approveReturn(data: {
    returnId: string;
    returnAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    notes?: string;
  }) {
    try {
      const db = getDatabase();

      // 获取退货记录
      const returnRecords = await db.select().from(returns).where(eq(returns.id, data.returnId)).limit(1);

      if (!returnRecords || returnRecords.length === 0) {
        throw new Error('Return not found');
      }

      const returnRecord = returnRecords[0];

      if (returnRecord.status !== 'requested') {
        throw new Error('Can only approve requested returns');
      }

      // 更新退货记录
      await db.update(returns).set({
        status: 'approved',
        returnAddress: data.returnAddress,
        approvedAt: new Date(),
      }).where(eq(returns.id, data.returnId));

      // 记录历史
      await db.insert(returnHistory).values({
        id: uuidv4(),
        returnId: data.returnId,
        status: 'approved',
        message: data.notes || 'Return approved',
      });

      logger.info(`Return approved: ${data.returnId}`);

      return { success: true, status: 'approved' };
    } catch (error) {
      logger.error('Failed to approve return:', error);
      throw error;
    }
  }

  /**
   * 拒绝退货请求
   */
  async rejectReturn(data: {
    returnId: string;
    reason: string;
  }) {
    try {
      const db = getDatabase();

      // 获取退货记录
      const returnRecords = await db.select().from(returns).where(eq(returns.id, data.returnId)).limit(1);

      if (!returnRecords || returnRecords.length === 0) {
        throw new Error('Return not found');
      }

      const returnRecord = returnRecords[0];

      if (returnRecord.status !== 'requested') {
        throw new Error('Can only reject requested returns');
      }

      // 更新退货记录
      await db.update(returns).set({
        status: 'rejected',
      }).where(eq(returns.id, data.returnId));

      // 记录历史
      await db.insert(returnHistory).values({
        id: uuidv4(),
        returnId: data.returnId,
        status: 'rejected',
        message: `Return rejected: ${data.reason}`,
      });

      logger.info(`Return rejected: ${data.returnId}`);

      return { success: true, status: 'rejected' };
    } catch (error) {
      logger.error('Failed to reject return:', error);
      throw error;
    }
  }

  /**
   * 更新退货状态
   */
  async updateReturnStatus(data: {
    returnId: string;
    status: 'shipped' | 'received' | 'refunded';
    trackingNumber?: string;
    notes?: string;
  }) {
    try {
      const db = getDatabase();

      // 获取退货记录
      const returnRecords = await db.select().from(returns).where(eq(returns.id, data.returnId)).limit(1);

      if (!returnRecords || returnRecords.length === 0) {
        throw new Error('Return not found');
      }

      const returnRecord = returnRecords[0];

      // 更新退货记录
      const updateData: any = { status: data.status };
      if (data.trackingNumber) {
        updateData.trackingNumber = data.trackingNumber;
      }
      if (data.status === 'shipped') {
        updateData.shippedAt = new Date();
      } else if (data.status === 'received') {
        updateData.receivedAt = new Date();
      } else if (data.status === 'refunded') {
        updateData.refundedAt = new Date();
        updateData.refundStatus = 'completed';
      }

      await db.update(returns).set(updateData).where(eq(returns.id, data.returnId));

      // 记录历史
      await db.insert(returnHistory).values({
        id: uuidv4(),
        returnId: data.returnId,
        status: data.status,
        message: data.notes || `Return status updated to ${data.status}`,
      });

      logger.info(`Return status updated: ${data.returnId} -> ${data.status}`);

      return { success: true, status: data.status };
    } catch (error) {
      logger.error('Failed to update return status:', error);
      throw error;
    }
  }

  /**
   * 获取退货详情
   */
  async getReturn(returnId: string) {
    try {
      const db = getDatabase();

      const returnRecords = await db.select().from(returns).where(eq(returns.id, returnId)).limit(1);

      if (!returnRecords || returnRecords.length === 0) {
        throw new Error('Return not found');
      }

      return returnRecords[0];
    } catch (error) {
      logger.error('Failed to get return:', error);
      throw error;
    }
  }

  /**
   * 获取订单的退货列表
   */
  async getOrderReturns(orderId: string) {
    try {
      const db = getDatabase();

      const orderReturns = await db.select().from(returns).where(eq(returns.orderId, orderId)).orderBy(desc(returns.createdAt));

      return orderReturns;
    } catch (error) {
      logger.error('Failed to get order returns:', error);
      throw error;
    }
  }

  /**
   * 获取用户的退货列表
   */
  async getUserReturns(userId: string) {
    try {
      const db = getDatabase();

      const userReturns = await db.select().from(returns).where(eq(returns.userId, userId)).orderBy(desc(returns.createdAt));

      return userReturns;
    } catch (error) {
      logger.error('Failed to get user returns:', error);
      throw error;
    }
  }

  /**
   * 获取退货历史
   */
  async getReturnHistory(returnId: string) {
    try {
      const db = getDatabase();

      const history = await db.select().from(returnHistory).where(eq(returnHistory.returnId, returnId)).orderBy(desc(returnHistory.createdAt));

      return history;
    } catch (error) {
      logger.error('Failed to get return history:', error);
      throw error;
    }
  }

  /**
   * 获取所有退货原因
   */
  async getReturnReasons() {
    try {
      const db = getDatabase();

      const reasons = await db.select().from(returnReasons).where(eq(returnReasons.isActive, '1'));

      return reasons;
    } catch (error) {
      logger.error('Failed to get return reasons:', error);
      throw error;
    }
  }

  /**
   * 获取退货政策
   */
  async getReturnPolicies() {
    try {
      const db = getDatabase();

      const policies = await db.select().from(returnPolicies).where(eq(returnPolicies.isActive, '1'));

      return policies;
    } catch (error) {
      logger.error('Failed to get return policies:', error);
      throw error;
    }
  }

  /**
   * 计算退款金额
   */
  async calculateRefundAmount(data: {
    originalAmount: number;
    returnReason: string;
  }) {
    try {
      const db = getDatabase();

      // 获取退货政策
      const policies = await db.select().from(returnPolicies).where(eq(returnPolicies.isActive, '1')).limit(1);

      if (!policies || policies.length === 0) {
        throw new Error('Return policy not found');
      }

      const policy = policies[0];
      const refundPercentage = typeof policy.refundPercentage === 'string' ? parseFloat(policy.refundPercentage) : policy.refundPercentage;
      const restockingFee = typeof policy.restockingFee === 'string' ? parseFloat(policy.restockingFee) : policy.restockingFee;

      const refundAmount = (data.originalAmount * refundPercentage) / 100 - restockingFee;

      return {
        originalAmount: data.originalAmount,
        refundAmount: Math.max(0, refundAmount),
        refundPercentage,
        restockingFee,
      };
    } catch (error) {
      logger.error('Failed to calculate refund amount:', error);
      throw error;
    }
  }
}

export default new ReturnService();
