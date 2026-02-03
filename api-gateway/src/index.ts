import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import config from './config/index.js';
import logger from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import proxyRoutes from './routes/proxy.js';

const app: Express = express();

// 日志
logger.info(`Starting API Gateway in ${config.nodeEnv} mode`);

// 中间件
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// HTTP 请求日志
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// 速率限制
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
  });
  next();
});

// 路由
app.use(proxyRoutes);

// 404 处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动服务器
const server = app.listen(config.port, () => {
  logger.info(`API Gateway listening on port ${config.port}`);
  logger.info('Microservices configuration:', {
    product: config.services.product,
    user: config.services.user,
    cart: config.services.cart,
    order: config.services.order,
    payment: config.services.payment,
    shipping: config.services.shipping,
    return: config.services.return,
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('API Gateway shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('API Gateway shut down');
    process.exit(0);
  });
});

export default app;
