import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { initializeDatabase } from './db/index.js';
import { appRouter } from './routers/index.js';
import logger from './middleware/logger.js';

const app = express();
const port = process.env.PORT || 3007;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// 健康检查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'return-service' });
});

// tRPC 路由
app.use(
  '/trpc',
  createHTTPHandler({
    router: appRouter,
  })
);

// 错误处理
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
async function start() {
  try {
    // 初始化数据库
    await initializeDatabase();
    logger.info('Database initialized');

    // 启动服务器
    app.listen(port, () => {
      logger.info(`Return service listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start return service:', error);
    process.exit(1);
  }
}

start();
