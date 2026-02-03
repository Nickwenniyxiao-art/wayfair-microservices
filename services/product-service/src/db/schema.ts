import { mysqlTable, varchar, text, decimal, int, timestamp, boolean, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 产品分类表
export const categories = mysqlTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  image: varchar('image', { length: 500 }),
  parentId: varchar('parent_id', { length: 36 }),
  displayOrder: int('display_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 产品属性表
export const attributes = mysqlTable('attributes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['text', 'select', 'multiselect', 'color', 'size']).default('text'),
  isRequired: boolean('is_required').default(false),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 产品表
export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  dimensions: varchar('dimensions', { length: 255 }), // JSON: {length, width, height}
  status: mysqlEnum('status', ['draft', 'active', 'inactive']).default('draft'),
  isFeatured: boolean('is_featured').default(false),
  viewCount: int('view_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default(0),
  ratingCount: int('rating_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 产品 SKU 表
export const productSkus = mysqlTable('product_skus', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: int('stock').notNull().default(0),
  reservedStock: int('reserved_stock').default(0),
  attributes: json('attributes').$type<Record<string, string>>(), // 属性组合
  barcode: varchar('barcode', { length: 100 }),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 产品图片表
export const productImages = mysqlTable('product_images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  displayOrder: int('display_order').default(0),
  isThumbnail: boolean('is_thumbnail').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 产品库存日志表
export const inventoryLogs = mysqlTable('inventory_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  skuId: varchar('sku_id', { length: 36 }).notNull(),
  type: mysqlEnum('type', ['adjustment', 'sale', 'return', 'damaged', 'lost']).notNull(),
  quantity: int('quantity').notNull(),
  reason: varchar('reason', { length: 255 }),
  referenceId: varchar('reference_id', { length: 36 }), // 订单 ID 或其他参考
  createdAt: timestamp('created_at').defaultNow(),
});

// 关系定义
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  attributes: many(attributes),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  skus: many(productSkus),
  images: many(productImages),
}));

export const productSkusRelations = relations(productSkus, ({ one, many }) => ({
  product: one(products, {
    fields: [productSkus.productId],
    references: [products.id],
  }),
  inventoryLogs: many(inventoryLogs),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
  sku: one(productSkus, {
    fields: [inventoryLogs.skuId],
    references: [productSkus.id],
  }),
}));

export const attributesRelations = relations(attributes, ({ one }) => ({
  category: one(categories, {
    fields: [attributes.categoryId],
    references: [categories.id],
  }),
}));
