import { mysqlTable, varchar, decimal, timestamp, json, text, mysqlEnum } from 'drizzle-orm/mysql-core';

// 配送表
export const shipments = mysqlTable('shipments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  status: mysqlEnum('status', ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed']).default('pending'),
  carrier: varchar('carrier', { length: 50 }),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  estimatedDelivery: timestamp('estimated_delivery'),
  actualDelivery: timestamp('actual_delivery'),
  shippingAddress: json('shipping_address').$type<{
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  shippingCost: decimal('shipping_cost', { precision: 15, scale: 2 }),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  dimensions: json('dimensions').$type<{
    length: number;
    width: number;
    height: number;
  }>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 配送历史表
export const shipmentHistory = mysqlTable('shipment_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  shipmentId: varchar('shipment_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  location: varchar('location', { length: 255 }),
  message: text('message'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// 配送方式表
export const shippingMethods = mysqlTable('shipping_methods', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  carrier: varchar('carrier', { length: 50 }).notNull(),
  basePrice: decimal('base_price', { precision: 15, scale: 2 }).notNull(),
  estimatedDays: varchar('estimated_days', { length: 50 }).notNull(),
  maxWeight: decimal('max_weight', { precision: 10, scale: 2 }),
  isActive: varchar('is_active', { length: 1 }).default('1'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 配送地区表
export const shippingZones = mysqlTable('shipping_zones', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  zipCodeRange: json('zip_code_range').$type<{
    start: string;
    end: string;
  }>(),
  multiplier: decimal('multiplier', { precision: 5, scale: 2 }).default('1.00'),
  createdAt: timestamp('created_at').defaultNow(),
});
