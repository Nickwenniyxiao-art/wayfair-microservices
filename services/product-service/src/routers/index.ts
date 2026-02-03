import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import productService from '../services/productService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create();

export const productRouter = t.router({
  // 获取产品列表
  list: t.procedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const products = await productService.getProducts(input);
        return { success: true, data: products };
      } catch (error: any) {
        logger.error('Failed to list products:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取产品详情
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const product = await productService.getProductById(input.id);
        return { success: true, data: product };
      } catch (error: any) {
        logger.error('Failed to get product:', error);
        return { success: false, error: error.message };
      }
    }),

  // 创建产品
  create: t.procedure
    .input(
      z.object({
        categoryId: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        basePrice: z.number(),
        cost: z.number().optional(),
        weight: z.number().optional(),
        dimensions: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const product = await productService.createProduct(input);
        return { success: true, data: product };
      } catch (error: any) {
        logger.error('Failed to create product:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新产品
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          basePrice: z.number().optional(),
          status: z.enum(['draft', 'active', 'inactive']).optional(),
          isFeatured: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await productService.updateProduct(input.id, input.data);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update product:', error);
        return { success: false, error: error.message };
      }
    }),

  // 删除产品
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await productService.deleteProduct(input.id);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to delete product:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取分类列表
  getCategories: t.procedure.query(async () => {
    try {
      const categories = await productService.getCategories();
      return { success: true, data: categories };
    } catch (error: any) {
      logger.error('Failed to get categories:', error);
      return { success: false, error: error.message };
    }
  }),

  // 创建 SKU
  createSku: t.procedure
    .input(
      z.object({
        productId: z.string(),
        sku: z.string(),
        price: z.number(),
        stock: z.number(),
        attributes: z.record(z.string()).optional(),
        barcode: z.string().optional(),
        weight: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const sku = await productService.createSku(input);
        return { success: true, data: sku };
      } catch (error: any) {
        logger.error('Failed to create SKU:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取产品 SKU
  getSkus: t.procedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      try {
        const skus = await productService.getSkusByProductId(input.productId);
        return { success: true, data: skus };
      } catch (error: any) {
        logger.error('Failed to get SKUs:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新库存
  updateStock: t.procedure
    .input(z.object({ skuId: z.string(), quantity: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const result = await productService.updateStock(input.skuId, input.quantity);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update stock:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  product: productRouter,
});

export type AppRouter = typeof appRouter;
