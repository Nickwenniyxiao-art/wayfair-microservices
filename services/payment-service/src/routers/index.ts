import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import paymentService from '../services/paymentService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create({
  isServer: true,
  allowOutsideOfServer: true,
});

export const paymentRouter = t.router({
  // 创建支付意向
  createPaymentIntent: t.procedure
    .input(
      z.object({
        orderId: z.string(),
        userId: z.string(),
        amount: z.number().min(0.01),
        currency: z.string().default('USD'),
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await paymentService.createPaymentIntent(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to create payment intent:', error);
        return { success: false, error: error.message };
      }
    }),

  // 确认支付
  confirmPayment: t.procedure
    .input(z.object({ paymentId: z.string(), stripePaymentIntentId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const result = await paymentService.confirmPayment(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to confirm payment:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取支付详情
  getPayment: t.procedure
    .input(z.object({ paymentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const payment = await paymentService.getPayment(input.paymentId);
        return { success: true, data: payment };
      } catch (error: any) {
        logger.error('Failed to get payment:', error);
        return { success: false, error: error.message };
      }
    }),

  // 创建退款
  createRefund: t.procedure
    .input(
      z.object({
        paymentId: z.string(),
        orderId: z.string(),
        amount: z.number().min(0.01),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await paymentService.createRefund(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to create refund:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取退款详情
  getRefund: t.procedure
    .input(z.object({ refundId: z.string() }))
    .query(async ({ input }) => {
      try {
        const refund = await paymentService.getRefund(input.refundId);
        return { success: true, data: refund };
      } catch (error: any) {
        logger.error('Failed to get refund:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取订单的支付列表
  getOrderPayments: t.procedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      try {
        const orderPayments = await paymentService.getOrderPayments(input.orderId);
        return { success: true, data: orderPayments };
      } catch (error: any) {
        logger.error('Failed to get order payments:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
