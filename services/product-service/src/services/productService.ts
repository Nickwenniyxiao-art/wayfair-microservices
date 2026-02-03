import { eq, like, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import getDatabase from '../db/index.js';
import { products, productSkus, productImages, categories } from '../db/schema.js';
import logger from '../middleware/logger.js';

export class ProductService {
  /**
   * 创建产品
   */
  async createProduct(data: {
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    basePrice: number;
    cost?: number;
    weight?: number;
    dimensions?: string;
  }) {
    try {
      const db = getDatabase();
      const id = uuidv4();

      const result = await db.insert(products).values({
        id,
        ...data,
        status: 'draft',
      });

      logger.info(`Product created: ${id}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to create product:', error);
      throw error;
    }
  }

  /**
   * 获取产品列表
   */
  async getProducts(options: {
    categoryId?: string;
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      const db = getDatabase();
      const { categoryId, search, status, limit = 20, offset = 0 } = options;

      const conditions = [];
      if (categoryId) conditions.push(eq(products.categoryId, categoryId));
      if (search) conditions.push(like(products.name, `%${search}%`));
      if (status) conditions.push(eq(products.status, status as any));

      const query = db.select().from(products);

      if (conditions.length > 0) {
        query.where(and(...conditions));
      }

      const result = await query
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset);

      return result;
    } catch (error) {
      logger.error('Failed to get products:', error);
      throw error;
    }
  }

  /**
   * 获取产品详情
   */
  async getProductById(id: string) {
    try {
      const db = getDatabase();

      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
          category: true,
          skus: true,
          images: true,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // 增加浏览次数
      await db.update(products).set({ viewCount: product.viewCount + 1 }).where(eq(products.id, id));

      return product;
    } catch (error) {
      logger.error('Failed to get product:', error);
      throw error;
    }
  }

  /**
   * 更新产品
   */
  async updateProduct(id: string, data: Partial<typeof products.$inferInsert>) {
    try {
      const db = getDatabase();

      await db.update(products).set(data).where(eq(products.id, id));

      logger.info(`Product updated: ${id}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to update product:', error);
      throw error;
    }
  }

  /**
   * 删除产品
   */
  async deleteProduct(id: string) {
    try {
      const db = getDatabase();

      await db.delete(products).where(eq(products.id, id));

      logger.info(`Product deleted: ${id}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete product:', error);
      throw error;
    }
  }

  /**
   * 创建产品 SKU
   */
  async createSku(data: {
    productId: string;
    sku: string;
    price: number;
    stock: number;
    attributes?: Record<string, string>;
    barcode?: string;
    weight?: number;
  }) {
    try {
      const db = getDatabase();
      const id = uuidv4();

      await db.insert(productSkus).values({
        id,
        ...data,
      });

      logger.info(`SKU created: ${id}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to create SKU:', error);
      throw error;
    }
  }

  /**
   * 获取产品 SKU
   */
  async getSkusByProductId(productId: string) {
    try {
      const db = getDatabase();

      const skus = await db.query.productSkus.findMany({
        where: eq(productSkus.productId, productId),
      });

      return skus;
    } catch (error) {
      logger.error('Failed to get SKUs:', error);
      throw error;
    }
  }

  /**
   * 更新库存
   */
  async updateStock(skuId: string, quantity: number) {
    try {
      const db = getDatabase();

      const sku = await db.query.productSkus.findFirst({
        where: eq(productSkus.id, skuId),
      });

      if (!sku) {
        throw new Error('SKU not found');
      }

      const newStock = sku.stock + quantity;
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      await db.update(productSkus).set({ stock: newStock }).where(eq(productSkus.id, skuId));

      logger.info(`Stock updated for SKU ${skuId}: ${newStock}`);
      return { skuId, stock: newStock };
    } catch (error) {
      logger.error('Failed to update stock:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories() {
    try {
      const db = getDatabase();

      const cats = await db.query.categories.findMany({
        where: eq(categories.isActive, true),
        orderBy: [categories.displayOrder],
      });

      return cats;
    } catch (error) {
      logger.error('Failed to get categories:', error);
      throw error;
    }
  }
}

export default new ProductService();
