import { mysqlTable, varchar, text, timestamp, boolean, decimal, mysqlEnum, json } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 用户表
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  avatar: varchar('avatar', { length: 500 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user'),
  status: mysqlEnum('status', ['active', 'inactive', 'suspended']).default('active'),
  emailVerified: boolean('email_verified').default(false),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  preferences: json('preferences').$type<Record<string, any>>(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 用户地址表
export const userAddresses = mysqlTable('user_addresses', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  type: mysqlEnum('type', ['shipping', 'billing']).default('shipping'),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 用户会员表
export const userMemberships = mysqlTable('user_memberships', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().unique(),
  tier: mysqlEnum('tier', ['bronze', 'silver', 'gold', 'platinum']).default('bronze'),
  points: decimal('points', { precision: 10, scale: 2 }).default(0),
  totalSpent: decimal('total_spent', { precision: 15, scale: 2 }).default(0),
  joinedAt: timestamp('joined_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 用户会话表
export const userSessions = mysqlTable('user_sessions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  token: varchar('token', { length: 500 }).notNull().unique(),
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 用户审计日志表
export const userAuditLogs = mysqlTable('user_audit_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  details: json('details').$type<Record<string, any>>(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 关系定义
export const usersRelations = relations(users, ({ many, one }) => ({
  addresses: many(userAddresses),
  membership: one(userMemberships),
  sessions: many(userSessions),
  auditLogs: many(userAuditLogs),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const userMembershipsRelations = relations(userMemberships, ({ one }) => ({
  user: one(users, {
    fields: [userMemberships.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const userAuditLogsRelations = relations(userAuditLogs, ({ one }) => ({
  user: one(users, {
    fields: [userAuditLogs.userId],
    references: [users.id],
  }),
}));
