import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import shippingService from '../services/shippingService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create({
  isServer: true,
  allowOutsideOfServer: true,
});

export const shippingRouter = t.router({
  // 创建配送单
  createShipment: t.procedure
    .input(
      z.object({
        orderId: z.string(),
        userId: z.string(),
        shippingAddress: z.object({
          recipientName: z.string(),
          phone: z.string(),
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          country: z.string(),
        }),
        weight: z.number().min(0.1),
        dimensions: z.object({
          length: z.number(),
          width: z.number(),
          height: z.number(),
        }).optional(),
        shippingMethodId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await shippingService.createShipment(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to create shipment:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新配送状态
  updateShipmentStatus: t.procedure
    .input(
      z.object({
        shipmentId: z.string(),
        status: z.enum(['processing', 'shipped', 'in_transit', 'delivered', 'failed']),
        trackingNumber: z.string().optional(),
        location: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await shippingService.updateShipmentStatus(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update shipment status:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取配送详情
  getShipment: t.procedure
    .input(z.object({ shipmentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const shipment = await shippingService.getShipment(input.shipmentId);
        return { success: true, data: shipment };
      } catch (error: any) {
        logger.error('Failed to get shipment:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取订单的配送单
  getOrderShipments: t.procedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      try {
        const shipments = await shippingService.getOrderShipments(input.orderId);
        return { success: true, data: shipments };
      } catch (error: any) {
        logger.error('Failed to get order shipments:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取配送历史
  getShipmentHistory: t.procedure
    .input(z.object({ shipmentId: z.string() }))
    .query(async ({ input }) => {
      try {
        const history = await shippingService.getShipmentHistory(input.shipmentId);
        return { success: true, data: history };
      } catch (error: any) {
        logger.error('Failed to get shipment history:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取所有配送方式
  getShippingMethods: t.procedure
    .query(async () => {
      try {
        const methods = await shippingService.getShippingMethods();
        return { success: true, data: methods };
      } catch (error: any) {
        logger.error('Failed to get shipping methods:', error);
        return { success: false, error: error.message };
      }
    }),

  // 计算配送费用
  calculateShippingCost: t.procedure
    .input(
      z.object({
        weight: z.number().min(0.1),
        country: z.string(),
        state: z.string(),
        shippingMethodId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await shippingService.calculateShippingCost(input);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to calculate shipping cost:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取用户的所有配送单
  getUserShipments: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const shipments = await shippingService.getUserShipments(input.userId);
        return { success: true, data: shipments };
      } catch (error: any) {
        logger.error('Failed to get user shipments:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  shipping: shippingRouter,
});

export type AppRouter = typeof appRouter;
