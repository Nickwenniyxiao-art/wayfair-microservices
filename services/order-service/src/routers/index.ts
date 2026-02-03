import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import orderService from '../services/orderService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create();

export const orderRouter = t.router({
  // 创建订单
  create: t.procedure
    .input(
      z.object({
        userId: z.string(),
        items: z.array(
          z.object({
            productId: z.string(),
            skuId: z.string(),
            productName: z.string(),
            quantity: z.number().min(1),
            price: z.number().min(0),
            attributes: z.record(z.string()).optional(),
          })
        ),
        shippingAddress: z.record(z.any()),
        billingAddress: z.record(z.any()),
        shippingAmount: z.number().min(0).default(0),
        taxAmount: z.number().min(0).default(0),
        discountAmount: z.number().min(0).default(0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await orderService.createOrder(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to create order:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取订单详情
  getOrder: t.procedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      try {
        const order = await orderService.getOrder(input.orderId);
        return { success: true, data: order };
      } catch (error: any) {
        logger.error('Failed to get order:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取用户订单列表
  getUserOrders: t.procedure
    .input(z.object({ userId: z.string(), limit: z.number().default(10), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      try {
        const orders = await orderService.getUserOrders(input.userId, input.limit, input.offset);
        return { success: true, data: orders };
      } catch (error: any) {
        logger.error('Failed to get user orders:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新订单状态
  updateStatus: t.procedure
    .input(z.object({ orderId: z.string(), status: z.string(), comment: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        await orderService.updateOrderStatus(input.orderId, input.status, input.comment);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to update order status:', error);
        return { success: false, error: error.message };
      }
    }),

  // 取消订单
  cancel: t.procedure
    .input(z.object({ orderId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        await orderService.cancelOrder(input.orderId, input.reason);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to cancel order:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取订单历史
  getHistory: t.procedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      try {
        const history = await orderService.getOrderHistory(input.orderId);
        return { success: true, data: history };
      } catch (error: any) {
        logger.error('Failed to get order history:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
