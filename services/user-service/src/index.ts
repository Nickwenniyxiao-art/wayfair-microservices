import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { initializeDatabase } from './db/index.js';
import { appRouter } from './routers/index.js';
import logger from './middleware/logger.js';

const app = express();
const port = parseInt(process.env.PORT || '3002', 10);

// 中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 请求日志
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// 初始化数据库并启动服务器
async function start() {
  try {
    logger.info('Initializing database...');
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // tRPC 路由
    app.use(
      '/trpc',
      createExpressMiddleware({
        router: appRouter,
        createContext: () => ({}),
      })
    );

    // 健康检查
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'user-service', timestamp: new Date().toISOString() });
    });

    // 启动服务器
    const server = app.listen(port, () => {
      logger.info(`User Service listening on port ${port}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('User Service shut down');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start User Service:', error);
    process.exit(1);
  }
}

start();

export default app;
