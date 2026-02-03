import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import userService from '../services/userService.js';
import logger from '../middleware/logger.js';

const t = initTRPC.create();

export const userRouter = t.router({
  // 注册
  register: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await userService.register(input);
        return { success: true, data: user };
      } catch (error: any) {
        logger.error('Registration failed:', error);
        return { success: false, error: error.message };
      }
    }),

  // 登录
  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await userService.login(input.email, input.password);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Login failed:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取用户信息
  getProfile: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await userService.getUserById(input.userId);
        return { success: true, data: user };
      } catch (error: any) {
        logger.error('Failed to get profile:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新用户信息
  updateProfile: t.procedure
    .input(
      z.object({
        userId: z.string(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          avatar: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await userService.updateUser(input.userId, input.data);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update profile:', error);
        return { success: false, error: error.message };
      }
    }),

  // 添加地址
  addAddress: t.procedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum(['shipping', 'billing']),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        email: z.string().email(),
        street: z.string(),
        city: z.string(),
        state: z.string().optional(),
        postalCode: z.string(),
        country: z.string(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { userId, ...data } = input;
        const address = await userService.addAddress(userId, data);
        return { success: true, data: address };
      } catch (error: any) {
        logger.error('Failed to add address:', error);
        return { success: false, error: error.message };
      }
    }),

  // 获取地址列表
  getAddresses: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const addresses = await userService.getUserAddresses(input.userId);
        return { success: true, data: addresses };
      } catch (error: any) {
        logger.error('Failed to get addresses:', error);
        return { success: false, error: error.message };
      }
    }),

  // 更新地址
  updateAddress: t.procedure
    .input(
      z.object({
        addressId: z.string(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          street: z.string().optional(),
          city: z.string().optional(),
          postalCode: z.string().optional(),
          isDefault: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await userService.updateAddress(input.addressId, input.data);
        return { success: true, data: result };
      } catch (error: any) {
        logger.error('Failed to update address:', error);
        return { success: false, error: error.message };
      }
    }),

  // 删除地址
  deleteAddress: t.procedure
    .input(z.object({ addressId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await userService.deleteAddress(input.addressId);
        return { success: true };
      } catch (error: any) {
        logger.error('Failed to delete address:', error);
        return { success: false, error: error.message };
      }
    }),

  // 验证令牌
  verifyToken: t.procedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = await userService.verifyToken(input.token);
        return { success: true, data: decoded };
      } catch (error: any) {
        logger.error('Token verification failed:', error);
        return { success: false, error: error.message };
      }
    }),

  // 登出
  logout: t.procedure
    .input(z.object({ userId: z.string(), token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await userService.logout(input.userId, input.token);
        return { success: true };
      } catch (error: any) {
        logger.error('Logout failed:', error);
        return { success: false, error: error.message };
      }
    }),
});

export const appRouter = t.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
