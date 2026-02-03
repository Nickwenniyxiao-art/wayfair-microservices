import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import getDatabase from '../db/index.js';
import { carts, cartItems, wishlists } from '../db/schema.js';
import logger from '../middleware/logger.js';

export class CartService {
  /**
   * 获取或创建购物车
   */
  async getOrCreateCart(userId: string) {
    try {
      const db = getDatabase();

      let cart = await db.query.carts.findFirst({
        where: and(eq(carts.userId, userId), eq(carts.status, 'active')),
        with: {
          items: true,
        },
      });

      if (!cart) {
        const id = uuidv4();
        await db.insert(carts).values({
          id,
          userId,
        });
        cart = { id, userId, status: 'active', totalItems: 0, totalPrice: 0, items: [] };
      }

      return cart;
    } catch (error) {
      logger.error('Failed to get or create cart:', error);
      throw error;
    }
  }

  /**
   * 添加商品到购物车
   */
  async addItem(cartId: string, data: {
    productId: string;
    skuId: string;
    quantity: number;
    price: number;
    attributes?: Record<string, string>;
  }) {
    try {
      const db = getDatabase();

      const id = uuidv4();
      await db.insert(cartItems).values({
        id,
        cartId,
        ...data,
      });

      // 更新购物车总数和价格
      await this.updateCartTotals(cartId);

      logger.info(`Item added to cart: ${cartId}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to add item to cart:', error);
      throw error;
    }
  }

  /**
   * 更新购物车商品数量
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    try {
      const db = getDatabase();

      const item = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, itemId),
      });

      if (!item) {
        throw new Error('Item not found');
      }

      if (quantity <= 0) {
        await db.delete(cartItems).where(eq(cartItems.id, itemId));
      } else {
        await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
      }

      // 更新购物车总数和价格
      await this.updateCartTotals(item.cartId);

      logger.info(`Item quantity updated: ${itemId}`);
      return { itemId, quantity };
    } catch (error) {
      logger.error('Failed to update item quantity:', error);
      throw error;
    }
  }

  /**
   * 删除购物车商品
   */
  async removeItem(itemId: string) {
    try {
      const db = getDatabase();

      const item = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, itemId),
      });

      if (!item) {
        throw new Error('Item not found');
      }

      await db.delete(cartItems).where(eq(cartItems.id, itemId));

      // 更新购物车总数和价格
      await this.updateCartTotals(item.cartId);

      logger.info(`Item removed from cart: ${itemId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to remove item from cart:', error);
      throw error;
    }
  }

  /**
   * 清空购物车
   */
  async clearCart(cartId: string) {
    try {
      const db = getDatabase();

      await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
      await db.update(carts).set({ totalItems: 0, totalPrice: 0 }).where(eq(carts.id, cartId));

      logger.info(`Cart cleared: ${cartId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to clear cart:', error);
      throw error;
    }
  }

  /**
   * 获取购物车详情
   */
  async getCart(cartId: string) {
    try {
      const db = getDatabase();

      const cart = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
        with: {
          items: true,
        },
      });

      if (!cart) {
        throw new Error('Cart not found');
      }

      return cart;
    } catch (error) {
      logger.error('Failed to get cart:', error);
      throw error;
    }
  }

  /**
   * 更新购物车总数和价格
   */
  private async updateCartTotals(cartId: string) {
    try {
      const db = getDatabase();

      const items = await db.query.cartItems.findMany({
        where: eq(cartItems.cartId, cartId),
      });

      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await db.update(carts).set({ totalItems, totalPrice }).where(eq(carts.id, cartId));
    } catch (error) {
      logger.error('Failed to update cart totals:', error);
      throw error;
    }
  }

  /**
   * 添加到收藏夹
   */
  async addToWishlist(userId: string, productId: string) {
    try {
      const db = getDatabase();

      const existing = await db.query.wishlists.findFirst({
        where: and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)),
      });

      if (existing) {
        return existing;
      }

      const id = uuidv4();
      await db.insert(wishlists).values({
        id,
        userId,
        productId,
      });

      logger.info(`Product added to wishlist: ${productId}`);
      return { id, userId, productId };
    } catch (error) {
      logger.error('Failed to add to wishlist:', error);
      throw error;
    }
  }

  /**
   * 从收藏夹删除
   */
  async removeFromWishlist(userId: string, productId: string) {
    try {
      const db = getDatabase();

      await db.delete(wishlists).where(
        and(eq(wishlists.userId, userId), eq(wishlists.productId, productId))
      );

      logger.info(`Product removed from wishlist: ${productId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to remove from wishlist:', error);
      throw error;
    }
  }

  /**
   * 获取收藏夹列表
   */
  async getWishlist(userId: string) {
    try {
      const db = getDatabase();

      const items = await db.query.wishlists.findMany({
        where: eq(wishlists.userId, userId),
      });

      return items;
    } catch (error) {
      logger.error('Failed to get wishlist:', error);
      throw error;
    }
  }
}

export default new CartService();
