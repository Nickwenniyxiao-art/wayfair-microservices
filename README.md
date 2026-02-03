# Wayfair 克隆 - 微服务架构

这是一个基于微服务架构的完整电商独立站解决方案，采用 Node.js + Express + tRPC + MySQL + Redis 技术栈。

## 项目结构

```
wayfair-microservices/
├── api-gateway/              # API 网关
├── services/
│   ├── product-service/      # 产品管理微服务
│   ├── user-service/         # 用户管理微服务
│   ├── cart-service/         # 购物车微服务
│   ├── order-service/        # 订单微服务
│   ├── payment-service/      # 支付微服务
│   ├── shipping-service/     # 物流微服务
│   └── return-service/       # 退货微服务
├── frontends/
│   ├── storefront/           # 电商平台前端
│   └── admin-panel/          # 商品管理中台
├── shared/                   # 共享库
├── scripts/                  # 脚本文件
├── docker-compose.yml        # Docker Compose 配置
└── README.md
```

## 技术栈

- **后端**：Node.js 22 + Express 4 + tRPC 11 + TypeScript
- **数据库**：MySQL 8 + Redis 7
- **前端**：React 19 + Tailwind CSS 4 + Vite
- **容器化**：Docker + Docker Compose
- **部署**：Google Cloud Platform (Cloud Run, Cloud SQL, Cloud Memorystore)

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 22+
- pnpm 或 npm

### 本地开发

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd wayfair-microservices
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   ```

3. **启动 Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **初始化数据库**
   ```bash
   docker-compose exec mysql mysql -u root -proot123456 < scripts/init-db.sql
   ```

5. **安装依赖并启动服务**
   ```bash
   # API Gateway
   cd api-gateway && pnpm install && pnpm dev

   # Product Service (新终端)
   cd services/product-service && pnpm install && pnpm dev

   # User Service (新终端)
   cd services/user-service && pnpm install && pnpm dev
   ```

6. **访问应用**
   - API Gateway: http://localhost:3000
   - Storefront: http://localhost:3100
   - Admin Panel: http://localhost:3200

## 微服务说明

### API 网关 (Port: 3000)
- 请求路由和转发
- 认证和授权
- 速率限制
- 错误处理

### 产品管理微服务 (Port: 3001)
- 产品 CRUD 操作
- 分类管理
- SKU 管理
- 库存管理
- 产品图片管理

### 用户管理微服务 (Port: 3002)
- 用户注册和登录
- 用户资料管理
- 地址管理
- 会员管理
- 会话管理

### 购物车微服务 (Port: 3003)
- 购物车 CRUD 操作
- 购物车持久化
- 购物车统计

### 订单微服务 (Port: 3004)
- 订单创建和管理
- 订单追踪
- 订单状态管理

### 支付微服务 (Port: 3005)
- Stripe 支付集成
- 支付流程管理
- 退款处理

### 物流微服务 (Port: 3006)
- 运费计算
- 配送追踪
- 物流管理

### 退货微服务 (Port: 3007)
- 退货申请
- 退货审核
- 退款处理

## 前端应用

### Storefront (Port: 3100)
电商平台前端，包括：
- 首页
- 产品列表和搜索
- 产品详情
- 购物车
- 结账流程
- 用户账户
- 订单历史

### Admin Panel (Port: 3200)
商品管理中台，包括：
- 仪表板
- 商品管理
- 库存管理
- 订单管理
- 用户管理
- 分析报表

## 数据库架构

每个微服务有独立的数据库：
- `product_db` - 产品服务
- `user_db` - 用户服务
- `cart_db` - 购物车服务
- `order_db` - 订单服务
- `payment_db` - 支付服务
- `shipping_db` - 物流服务
- `return_db` - 退货服务
- `wayfair_db` - 主数据库（服务配置、审计日志等）

## API 文档

所有微服务都使用 tRPC，支持自动类型推导。

### 产品服务 API
```typescript
// 获取产品列表
product.list({ categoryId, search, limit, offset })

// 获取产品详情
product.getById({ id })

// 创建产品
product.create({ categoryId, name, slug, description, basePrice, ... })

// 更新产品
product.update({ id, data })

// 删除产品
product.delete({ id })
```

### 用户服务 API
```typescript
// 注册
user.register({ email, password, firstName, lastName })

// 登录
user.login({ email, password })

// 获取用户资料
user.getProfile({ userId })

// 更新用户资料
user.updateProfile({ userId, data })

// 添加地址
user.addAddress({ userId, type, firstName, lastName, ... })

// 获取地址列表
user.getAddresses({ userId })
```

## 部署到 GCP

### 前置要求
- Google Cloud 账户
- gcloud CLI
- kubectl（用于 GKE）

### 部署步骤

1. **设置 GCP 项目**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **创建 Cloud SQL 实例**
   ```bash
   gcloud sql instances create wayfair-mysql \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

3. **创建 Cloud Memorystore Redis 实例**
   ```bash
   gcloud redis instances create wayfair-redis \
     --size=1 \
     --region=us-central1
   ```

4. **构建和推送 Docker 镜像**
   ```bash
   # 设置 Docker 认证
   gcloud auth configure-docker

   # 构建和推送镜像
   docker build -t gcr.io/YOUR_PROJECT_ID/product-service ./services/product-service
   docker push gcr.io/YOUR_PROJECT_ID/product-service
   ```

5. **部署到 Cloud Run**
   ```bash
   gcloud run deploy product-service \
     --image gcr.io/YOUR_PROJECT_ID/product-service \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 测试

### 运行单元测试
```bash
cd services/product-service
pnpm test
```

### 运行集成测试
```bash
# 待实现
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
# Cloud Build permissions fixed
# Build triggered at Tue Feb  3 11:58:19 EST 2026
# IAM permissions configured - Tue Feb  3 12:19:23 EST 2026
