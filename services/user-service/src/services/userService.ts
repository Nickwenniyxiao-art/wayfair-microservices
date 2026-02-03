import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDatabase from '../db/index.js';
import { users, userAddresses, userMemberships, userSessions } from '../db/schema.js';
import logger from '../middleware/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class UserService {
  /**
   * 注册用户
   */
  async register(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    try {
      const db = getDatabase();

      // 检查邮箱是否已存在
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      const id = uuidv4();
      const passwordHash = await bcrypt.hash(data.password, 10);

      // 创建用户
      await db.insert(users).values({
        id,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // 创建会员记录
      await db.insert(userMemberships).values({
        id: uuidv4(),
        userId: id,
      });

      logger.info(`User registered: ${id}`);
      return { id, email: data.email };
    } catch (error) {
      logger.error('Failed to register user:', error);
      throw error;
    }
  }

  /**
   * 登录用户
   */
  async login(email: string, password: string) {
    try {
      const db = getDatabase();

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        throw new Error('User not found');
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error('Invalid password');
      }

      // 生成 JWT 令牌
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 创建会话
      const sessionId = uuidv4();
      await db.insert(userSessions).values({
        id: sessionId,
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // 更新最后登录时间
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

      logger.info(`User logged in: ${user.id}`);
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      logger.error('Failed to login user:', error);
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserById(id: string) {
    try {
      const db = getDatabase();

      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          addresses: true,
          membership: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Failed to get user:', error);
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    try {
      const db = getDatabase();

      await db.update(users).set(data).where(eq(users.id, id));

      logger.info(`User updated: ${id}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to update user:', error);
      throw error;
    }
  }

  /**
   * 添加地址
   */
  async addAddress(userId: string, data: Omit<typeof userAddresses.$inferInsert, 'id'>) {
    try {
      const db = getDatabase();

      const id = uuidv4();
      await db.insert(userAddresses).values({
        id,
        userId,
        ...data,
      });

      logger.info(`Address added for user: ${userId}`);
      return { id, ...data };
    } catch (error) {
      logger.error('Failed to add address:', error);
      throw error;
    }
  }

  /**
   * 获取用户地址列表
   */
  async getUserAddresses(userId: string) {
    try {
      const db = getDatabase();

      const addresses = await db.query.userAddresses.findMany({
        where: eq(userAddresses.userId, userId),
      });

      return addresses;
    } catch (error) {
      logger.error('Failed to get user addresses:', error);
      throw error;
    }
  }

  /**
   * 更新地址
   */
  async updateAddress(addressId: string, data: Partial<typeof userAddresses.$inferInsert>) {
    try {
      const db = getDatabase();

      await db.update(userAddresses).set(data).where(eq(userAddresses.id, addressId));

      logger.info(`Address updated: ${addressId}`);
      return { addressId, ...data };
    } catch (error) {
      logger.error('Failed to update address:', error);
      throw error;
    }
  }

  /**
   * 删除地址
   */
  async deleteAddress(addressId: string) {
    try {
      const db = getDatabase();

      await db.delete(userAddresses).where(eq(userAddresses.id, addressId));

      logger.info(`Address deleted: ${addressId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete address:', error);
      throw error;
    }
  }

  /**
   * 验证令牌
   */
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Invalid token');
    }
  }

  /**
   * 登出用户
   */
  async logout(userId: string, token: string) {
    try {
      const db = getDatabase();

      await db.delete(userSessions).where(
        and(eq(userSessions.userId, userId), eq(userSessions.token, token))
      );

      logger.info(`User logged out: ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to logout user:', error);
      throw error;
    }
  }
}

export default new UserService();
