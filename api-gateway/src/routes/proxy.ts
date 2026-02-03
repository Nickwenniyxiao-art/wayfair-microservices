import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from '../config/index.js';
import { AuthRequest, optionalAuth, requireAuth } from '../middleware/auth.js';
import logger from '../middleware/logger.js';

const router = Router();

/**
 * 代理请求到微服务
 */
const proxyRequest = async (
  req: AuthRequest,
  res: Response,
  serviceUrl: string,
  next: NextFunction
) => {
  try {
    const url = `${serviceUrl}${req.path}`;
    const headers = {
      ...req.headers,
      'x-forwarded-for': req.ip || '',
      'x-user-id': req.user?.id || '',
    };

    // 删除 host 和 connection 头，避免冲突
    delete headers.host;
    delete headers.connection;

    logger.info(`Proxying ${req.method} ${req.path} to ${url}`);

    const response = await axios({
      method: req.method as any,
      url,
      headers,
      data: req.body,
      params: req.query,
      validateStatus: () => true, // 接受所有状态码
    });

    res.status(response.status).set(response.headers).json(response.data);
  } catch (error: any) {
    logger.error(`Proxy error: ${error.message}`, { path: req.path });
    res.status(502).json({
      error: {
        code: 'GATEWAY_ERROR',
        message: 'Bad Gateway: Service unavailable',
      },
    });
  }
};

// 产品服务路由
router.all('/api/products*', optionalAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.product, next)
);

router.all('/api/categories*', optionalAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.product, next)
);

// 用户服务路由
router.all('/api/auth*', (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.user, next)
);

router.all('/api/users*', requireAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.user, next)
);

// 购物车服务路由
router.all('/api/carts*', requireAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.cart, next)
);

// 订单服务路由
router.all('/api/orders*', requireAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.order, next)
);

// 支付服务路由
router.all('/api/payments*', requireAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.payment, next)
);

// 物流服务路由
router.all('/api/shipping*', optionalAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.shipping, next)
);

// 退货服务路由
router.all('/api/returns*', requireAuth, (req: AuthRequest, res: Response, next: NextFunction) =>
  proxyRequest(req, res, config.services.return, next)
);

// 健康检查端点
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
