import { mysqlTable, varchar, decimal, timestamp, json, text, mysqlEnum } from 'drizzle-orm/mysql-core';

// 支付表
export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed', 'refunded']).default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
  metadata: json('metadata').$type<Record<string, any>>(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 退款表
export const refunds = mysqlTable('refunds', {
  id: varchar('id', { length: 36 }).primaryKey(),
  paymentId: varchar('payment_id', { length: 36 }).notNull(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  reason: varchar('reason', { length: 255 }),
  status: mysqlEnum('status', ['pending', 'completed', 'failed']).default('pending'),
  stripeRefundId: varchar('stripe_refund_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 支付历史表
export const paymentHistory = mysqlTable('payment_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  paymentId: varchar('payment_id', { length: 36 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});
