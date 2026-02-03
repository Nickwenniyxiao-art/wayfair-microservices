import { mysqlTable, varchar, int, decimal, timestamp, json, text, enum as mysqlEnum } from 'drizzle-orm/mysql-core';

// 订单表
export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']).default('pending'),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).notNull(),
  shippingAmount: decimal('shipping_amount', { precision: 15, scale: 2 }).default(0),
  taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).default(0),
  discountAmount: decimal('discount_amount', { precision: 15, scale: 2 }).default(0),
  notes: text('notes'),
  shippingAddress: json('shipping_address').$type<Record<string, any>>(),
  billingAddress: json('billing_address').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 订单项目表
export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  skuId: varchar('sku_id', { length: 36 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: int('quantity').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  attributes: json('attributes').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 订单历史表
export const orderHistory = mysqlTable('order_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});
