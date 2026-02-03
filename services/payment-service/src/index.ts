import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { initializeDatabase } from './db/index.js';
import { appRouter } from './routers/index.js';
import logger from './middleware/logger.js';
import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 3005;

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
  res.json({ status: 'ok', service: 'payment-service' });
});

// tRPC 路由
app.use(
  '/trpc',
  createHTTPHandler({
    router: appRouter,
  })
);

// Webhook 处理
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    logger.info(`Webhook received: ${event.type}`);

    // 处理 webhook
    // TODO: 实现 webhook 处理逻辑

    res.json({ received: true });
  } catch (error: any) {
    logger.error('Webhook signature verification failed:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

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
      logger.info(`Payment service listening on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start payment service:', error);
    process.exit(1);
  }
}

start();
