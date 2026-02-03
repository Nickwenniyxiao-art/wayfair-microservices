import { mysqlTable, varchar, int, decimal, timestamp, json, boolean } from 'drizzle-orm/mysql-core';

// 购物车表
export const carts = mysqlTable('carts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).default('active'),
  totalItems: int('total_items').default(0),
  totalPrice: decimal('total_price', { precision: 15, scale: 2 }).default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 购物车项目表
export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  cartId: varchar('cart_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  skuId: varchar('sku_id', { length: 36 }).notNull(),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  attributes: json('attributes').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 收藏夹表
export const wishlists = mysqlTable('wishlists', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
