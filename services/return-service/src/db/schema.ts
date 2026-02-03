import { mysqlTable, varchar, decimal, timestamp, json, text, mysqlEnum } from 'drizzle-orm/mysql-core';

// 退货表
export const returns = mysqlTable('returns', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  status: mysqlEnum('status', ['requested', 'approved', 'rejected', 'shipped', 'received', 'refunded']).default('requested'),
  reason: varchar('reason', { length: 255 }).notNull(),
  description: text('description'),
  refundAmount: decimal('refund_amount', { precision: 15, scale: 2 }).notNull(),
  refundStatus: mysqlEnum('refund_status', ['pending', 'processing', 'completed', 'failed']).default('pending'),
  returnAddress: json('return_address').$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  images: json('images').$type<string[]>(),
  notes: text('notes'),
  requestedAt: timestamp('requested_at').defaultNow(),
  approvedAt: timestamp('approved_at'),
  shippedAt: timestamp('shipped_at'),
  receivedAt: timestamp('received_at'),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 退货历史表
export const returnHistory = mysqlTable('return_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  returnId: varchar('return_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  message: text('message'),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 退货原因表
export const returnReasons = mysqlTable('return_reasons', {
  id: varchar('id', { length: 36 }).primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isActive: varchar('is_active', { length: 1 }).default('1'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 退货政策表
export const returnPolicies = mysqlTable('return_policies', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  returnWindow: varchar('return_window', { length: 50 }).notNull(), // e.g., "30 days"
  refundPercentage: decimal('refund_percentage', { precision: 5, scale: 2 }).default('100.00'),
  restockingFee: decimal('restocking_fee', { precision: 5, scale: 2 }).default('0.00'),
  isActive: varchar('is_active', { length: 1 }).default('1'),
  createdAt: timestamp('created_at').defaultNow(),
});
