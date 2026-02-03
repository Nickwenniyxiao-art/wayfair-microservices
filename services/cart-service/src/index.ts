import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { initializeDatabase } from './db/index.js';
import { appRouter } from './routers/index.js';
import logger from './middleware/logger.js';

const app = express();
const port = process.env.CART_SERVICE_PORT || 3003;

// 中间件
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

// tRPC 路由
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务
async function start() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      logger.info(`Cart service running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start cart service:', error);
    process.exit(1);
  }
}

start();
