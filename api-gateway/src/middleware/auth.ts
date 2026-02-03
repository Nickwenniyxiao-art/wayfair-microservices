import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import logger from './logger.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * 验证 JWT 令牌
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
};

/**
 * 认证中间件 - 可选
 * 如果提供了令牌，则验证；如果没有，则继续
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

/**
 * 认证中间件 - 必需
 * 必须提供有效的令牌
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn('Invalid token');
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  req.user = decoded;
  next();
};

/**
 * 角色检查中间件
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`User ${req.user.id} does not have required role`);
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

/**
 * 生成 JWT 令牌
 */
export const generateToken = (payload: any, expiresIn: string = '7d'): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};
