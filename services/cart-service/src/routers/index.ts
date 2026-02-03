import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import cartService from '../services/cartService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create();

export const cartRouter = t.router({
  // 获取或创建购物车
  getOrCreate: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const cart = await cartService.getOrCreateCart(input.userId);
        return { success: true, data: cart };
      } catch (error: any) {
        logger.error('Failed to get or create cart:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取购物车详情
  getCart: t.procedure
    .input(z.object({ cartId: z.string() }))
    .query(async ({ input }) => {
      try {
        const cart = await cartService.getCart(input.cartId);
        return { success: true, data: cart };
      } catch (error: any) {
        logger.error('Failed to get cart:', error);
        return { success: false, error: error.message };
      }
    }),

  // 添加商品到购物车
  addItem: t.procedure
    .input(
      z.object({
        cartId: z.string(),
        productId: z.string(),
        skuId: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
        attributes: z.record(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const item = await cartService.addItem(input.cartId, {
          productId: input.productId,
          skuId: input.skuId,
          quantity: input.quantity,
          price: input.price,
          attributes: input.attributes,
        });
        return { success: true, data: item };
      } catch (error: any) {
        logger.error('Failed to add item to cart:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新商品数量
  updateItemQuantity: t.procedure
    .input(z.object({ itemId: z.string(), quantity: z.number().min(0) }))
    .mutation(async ({ input }) => {
      try {
        const result = await cartService.updateItemQuantity(input.itemId, input.quantity);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update item quantity:', error);
        return { success: false, error: error.message };
      }
    }),

  // 删除商品
  removeItem: t.procedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await cartService.removeItem(input.itemId);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to remove item:', error);
        return { success: false, error: error.message };
      }
    }),

  // 清空购物车
  clearCart: t.procedure
    .input(z.object({ cartId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await cartService.clearCart(input.cartId);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to clear cart:', error);
        return { success: false, error: error.message };
      }
    }),

  // 添加到收藏夹
  addToWishlist: t.procedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const item = await cartService.addToWishlist(input.userId, input.productId);
        return { success: true, data: item };
      } catch (error: any) {
        logger.error('Failed to add to wishlist:', error);
        return { success: false, error: error.message };
      }
    }),

  // 从收藏夹删除
  removeFromWishlist: t.procedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await cartService.removeFromWishlist(input.userId, input.productId);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to remove from wishlist:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取收藏夹
  getWishlist: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const items = await cartService.getWishlist(input.userId);
        return { success: true, data: items };
      } catch (error: any) {
        logger.error('Failed to get wishlist:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  cart: cartRouter,
});

export type AppRouter = typeof appRouter;
