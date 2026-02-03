import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',

  // 微服务 URLs
  services: {
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    shipping: process.env.SHIPPING_SERVICE_URL || 'http://localhost:3006',
    return: process.env.RETURN_SERVICE_URL || 'http://localhost:3007',
  },

  // 速率限制配置
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 限制每个 IP 在 windowMs 内的请求数
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};

export default config;
