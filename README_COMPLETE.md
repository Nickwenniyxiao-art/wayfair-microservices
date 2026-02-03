# Wayfair Clone - 微服务电商平台

一个完整的电商微服务架构平台，类似于 Wayfair。包含 8 个独立的微服务、API 网关、两个前端应用和完整的 Docker 编排。

## 项目概述

### 架构设计
- **微服务架构**: 8 个独立的业务服务
- **API 网关**: 统一的请求入口
- **前端应用**: 客户端和管理后台
- **容器化**: Docker + Docker Compose
- **类型安全**: TypeScript + tRPC

### 核心特性
- 完整的电商功能流程
- 支付集成 (Stripe)
- 订单管理和追踪
- 用户账户管理
- 产品管理和库存
- 购物车和结账
- 配送管理
- 退货处理

## 项目结构

```
wayfair-microservices/
├── api-gateway/                    # API 网关 (3000)
├── services/
│   ├── product-service/           # 产品管理 (3001)
│   ├── user-service/              # 用户管理 (3002)
│   ├── cart-service/              # 购物车 (3003)
│   ├── order-service/             # 订单管理 (3004)
│   ├── payment-service/           # 支付处理 (3005)
│   ├── shipping-service/          # 配送管理 (3006)
│   └── return-service/            # 退货管理 (3007)
├── frontends/
│   ├── storefront/                # 客户端 (5173)
│   └── admin-panel/               # 管理后台 (5174)
├── scripts/
│   └── init-databases.sql         # 数据库初始化
├── docker-compose.yml             # Docker 编排
└── README.md                       # 项目文档
```

## 微服务详情

### 1. API Gateway (端口 3000)
**功能**: 请求路由、认证、速率限制
- 请求转发到各个微服务
- JWT 认证
- 速率限制
- 错误处理

### 2. Product Service (端口 3001)
**功能**: 产品管理、分类、库存
- 产品列表和搜索
- 产品详情
- 分类管理
- SKU 管理
- 库存追踪

### 3. User Service (端口 3002)
**功能**: 用户管理、认证、地址
- 用户注册和登录
- 用户信息管理
- 地址管理
- 会话管理

### 4. Cart Service (端口 3003)
**功能**: 购物车管理
- 添加/移除商品
- 更新数量
- 清空购物车
- 价格计算

### 5. Order Service (端口 3004)
**功能**: 订单管理
- 订单创建
- 订单追踪
- 状态管理
- 订单历史

### 6. Payment Service (端口 3005)
**功能**: 支付处理 (Stripe 集成)
- 创建支付意向
- 支付确认
- 退款处理
- Webhook 处理

### 7. Shipping Service (端口 3006)
**功能**: 配送管理
- 创建配送单
- 状态更新
- 费用计算
- 配送方式管理

### 8. Return Service (端口 3007)
**功能**: 退货管理
- 退货请求
- 审批流程
- 退款计算
- 退货追踪

## 技术栈

### 后端
- **运行时**: Node.js 20
- **语言**: TypeScript
- **框架**: Express.js
- **API**: tRPC
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **ORM**: Drizzle ORM
- **日志**: Winston
- **支付**: Stripe

### 前端
- **框架**: React 19
- **样式**: Tailwind CSS 4
- **构建**: Vite
- **HTTP**: tRPC Client

### 部署
- **容器**: Docker
- **编排**: Docker Compose
- **云平台**: Google Cloud Platform (可选)

## 快速开始

### 前置要求
- Docker 和 Docker Compose
- Node.js 20+ (本地开发)
- MySQL 8.0+ (本地开发)
- Redis 7+ (本地开发)

### 使用 Docker Compose 启动

```bash
# 进入项目目录
cd /home/ubuntu/wayfair-microservices

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

### 本地开发

#### 1. 启动数据库和缓存
```bash
docker-compose up -d mysql redis
```

#### 2. 启动各个微服务
```bash
# 在不同的终端窗口中运行

# Product Service
cd services/product-service
npm install
npm run dev

# User Service
cd services/user-service
npm install
npm run dev

# Cart Service
cd services/cart-service
npm install
npm run dev

# Order Service
cd services/order-service
npm install
npm run dev

# Payment Service
cd services/payment-service
npm install
npm run dev

# Shipping Service
cd services/shipping-service
npm install
npm run dev

# Return Service
cd services/return-service
npm install
npm run dev

# API Gateway
cd api-gateway
npm install
npm run dev
```

#### 3. 启动前端应用
```bash
# Storefront
cd frontends/storefront
npm install
npm run dev

# Admin Panel
cd frontends/admin-panel
npm install
npm run dev
```

## API 端点

### API Gateway (3000)
- `GET /health` - 健康检查
- `/api/products/*` - 产品相关
- `/api/users/*` - 用户相关
- `/api/cart/*` - 购物车相关
- `/api/orders/*` - 订单相关
- `/api/payments/*` - 支付相关
- `/api/shipments/*` - 配送相关
- `/api/returns/*` - 退货相关

### 各微服务 tRPC 端点
- `http://localhost:3001/trpc` - Product Service
- `http://localhost:3002/trpc` - User Service
- `http://localhost:3003/trpc` - Cart Service
- `http://localhost:3004/trpc` - Order Service
- `http://localhost:3005/trpc` - Payment Service
- `http://localhost:3006/trpc` - Shipping Service
- `http://localhost:3007/trpc` - Return Service

## 前端应用

### Storefront (5173)
客户购物平台
- 首页
- 产品列表和搜索
- 产品详情
- 购物车
- 结账流程
- 用户账户

### Admin Panel (5174)
商家管理平台
- 仪表板
- 产品管理
- 订单管理
- 用户管理
- 分析报表

## 数据库

### 数据库列表
- `product_db` - 产品数据
- `user_db` - 用户数据
- `cart_db` - 购物车数据
- `order_db` - 订单数据
- `payment_db` - 支付数据
- `shipping_db` - 配送数据
- `return_db` - 退货数据

### 初始化
数据库通过 `scripts/init-databases.sql` 自动初始化。

## 环境变量

### 通用配置
```env
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
```

### 数据库配置
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=product_db
```

### 支付配置
```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 前端配置
```env
VITE_API_URL=http://localhost:3000
```

## 开发指南

### 添加新的 API 端点

#### 1. 在微服务中定义 tRPC 路由
```typescript
// services/product-service/src/routers/index.ts
export const productRouter = t.router({
  getProducts: t.procedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ input }) => {
      // 实现逻辑
    }),
});
```

#### 2. 在 API Gateway 中添加路由
```typescript
// api-gateway/src/routes/products.ts
app.get('/api/products', async (req, res) => {
  const result = await trpcClient.product.getProducts.query({ limit: 10 });
  res.json(result);
});
```

#### 3. 在前端中调用 API
```typescript
// frontends/storefront/src/pages/Products.tsx
const { data } = await trpc.product.getProducts.useQuery({ limit: 10 });
```

### 数据库迁移

#### 使用 Drizzle Kit
```bash
# 生成迁移
pnpm db:generate

# 执行迁移
pnpm db:migrate

# 推送到数据库
pnpm db:push
```

## 部署

### Docker 构建
```bash
# 构建所有镜像
docker-compose build

# 构建特定服务
docker-compose build product-service
```

### Google Cloud Platform 部署

#### 1. 配置 Cloud SQL
```bash
gcloud sql instances create wayfair-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1
```

#### 2. 配置 Cloud Run
```bash
gcloud run deploy product-service \
  --image gcr.io/PROJECT_ID/product-service \
  --platform managed \
  --region us-central1
```

#### 3. 配置 Cloud Build
```bash
gcloud builds submit --config cloudbuild.yaml
```

## 监控和日志

### 查看服务日志
```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f product-service

# 实时跟踪
docker-compose logs -f --tail=100
```

### 健康检查
```bash
# 检查 API Gateway
curl http://localhost:3000/health

# 检查各微服务
curl http://localhost:3001/health
curl http://localhost:3002/health
# ... 等等
```

## 性能优化

### 缓存策略
- 使用 Redis 缓存频繁访问的数据
- 实现缓存失效策略
- 使用缓存预热

### 数据库优化
- 添加适当的索引
- 使用连接池
- 实现查询优化

### 负载均衡
- 使用 Nginx 进行负载均衡
- 配置自动扩展
- 实现服务发现

## 安全性

### 认证和授权
- JWT 令牌认证
- 角色基访问控制 (RBAC)
- API 密钥管理

### 数据保护
- 加密敏感数据
- HTTPS/TLS 通信
- 环境变量管理

### 速率限制
- API 速率限制
- DDoS 防护
- 请求验证

## 故障排除

### 常见问题

#### 1. 数据库连接失败
```bash
# 检查 MySQL 是否运行
docker-compose ps mysql

# 查看 MySQL 日志
docker-compose logs mysql

# 重启 MySQL
docker-compose restart mysql
```

#### 2. 服务无法启动
```bash
# 检查端口是否被占用
lsof -i :3000

# 查看服务日志
docker-compose logs product-service

# 重建镜像
docker-compose build --no-cache product-service
```

#### 3. 数据库迁移失败
```bash
# 检查迁移文件
ls drizzle/migrations/

# 手动执行 SQL
mysql -u root -p < migration.sql

# 重置数据库
docker-compose exec mysql mysql -u root -p -e "DROP DATABASE product_db; CREATE DATABASE product_db;"
```

## 贡献指南

### 代码风格
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 提交规范
- 使用 Conventional Commits
- 编写清晰的提交信息
- 包含相关的 issue 号

### 测试
- 编写单元测试
- 编写集成测试
- 保持测试覆盖率 > 80%

## 许可证

MIT License

## 联系方式

- 项目主页: https://github.com/your-repo/wayfair-microservices
- 问题报告: https://github.com/your-repo/wayfair-microservices/issues
- 讨论: https://github.com/your-repo/wayfair-microservices/discussions

## 致谢

感谢所有贡献者和开源社区的支持。

---

**最后更新**: 2026-02-03
**项目状态**: 微服务完成，前端开发中
**代码行数**: 4,300+ 行 TypeScript
