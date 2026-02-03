import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import returnService from '../services/returnService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create({
  isServer: true,
  allowOutsideOfServer: true,
});

export const returnRouter = t.router({
  // 创建退货请求
  createReturnRequest: t.procedure
    .input(
      z.object({
        orderId: z.string(),
        userId: z.string(),
        reason: z.string(),
        description: z.string().optional(),
        refundAmount: z.number().min(0.01),
        images: z.array(z.string()).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await returnService.createReturnRequest(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to create return request:', error);
        return { success: false, error: error.message };
      }
    }),

  // 批准退货请求
  approveReturn: t.procedure
    .input(
      z.object({
        returnId: z.string(),
        returnAddress: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          country: z.string(),
        }),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await returnService.approveReturn(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to approve return:', error);
        return { success: false, error: error.message };
      }
    }),

  // 拒绝退货请求
  rejectReturn: t.procedure
    .input(
      z.object({
        returnId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await returnService.rejectReturn(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to reject return:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新退货状态
  updateReturnStatus: t.procedure
    .input(
      z.object({
        returnId: z.string(),
        status: z.enum(['shipped', 'received', 'refunded']),
        trackingNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await returnService.updateReturnStatus(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update return status:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取退货详情
  getReturn: t.procedure
    .input(z.object({ returnId: z.string() }))
    .query(async ({ input }) => {
      try {
        const returnData = await returnService.getReturn(input.returnId);
        return { success: true, data: returnData };
      } catch (error: any) {
        logger.error('Failed to get return:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取订单的退货列表
  getOrderReturns: t.procedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      try {
        const returns = await returnService.getOrderReturns(input.orderId);
        return { success: true, data: returns };
      } catch (error: any) {
        logger.error('Failed to get order returns:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取用户的退货列表
  getUserReturns: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const returns = await returnService.getUserReturns(input.userId);
        return { success: true, data: returns };
      } catch (error: any) {
        logger.error('Failed to get user returns:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取退货历史
  getReturnHistory: t.procedure
    .input(z.object({ returnId: z.string() }))
    .query(async ({ input }) => {
      try {
        const history = await returnService.getReturnHistory(input.returnId);
        return { success: true, data: history };
      } catch (error: any) {
        logger.error('Failed to get return history:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取所有退货原因
  getReturnReasons: t.procedure
    .query(async () => {
      try {
        const reasons = await returnService.getReturnReasons();
        return { success: true, data: reasons };
      } catch (error: any) {
        logger.error('Failed to get return reasons:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取退货政策
  getReturnPolicies: t.procedure
    .query(async () => {
      try {
        const policies = await returnService.getReturnPolicies();
        return { success: true, data: policies };
      } catch (error: any) {
        logger.error('Failed to get return policies:', error);
        return { success: false, error: error.message };
      }
    }),

  // 计算退款金额
  calculateRefundAmount: t.procedure
    .input(
      z.object({
        originalAmount: z.number().min(0.01),
        returnReason: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await returnService.calculateRefundAmount(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to calculate refund amount:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  return: returnRouter,
});

export type AppRouter = typeof appRouter;
