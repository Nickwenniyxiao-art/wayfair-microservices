import { Request, Response, NextFunction } from 'express';
import logger from './logger.js';

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

/**
 * 错误处理中间件
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  logger.error(`Error [${status}]: ${message}`, {
    code,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({
    error: {
      code,
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * 404 处理中间件
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: ApiError = new Error(`Route not found: ${req.method} ${req.path}`);
  error.status = 404;
  error.code = 'NOT_FOUND';
  next(error);
};

/**
 * 创建 API 错误
 */
export const createApiError = (
  message: string,
  status: number = 500,
  code: string = 'INTERNAL_ERROR'
): ApiError => {
  const error: ApiError = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};
