# Wayfair 克隆 - 微服务架构开发计划

## 项目概述

这是一个完整的电商独立站微服务架构项目，采用现代化的分布式系统设计。项目分为三个阶段开发，第一阶段包括 8 个核心微服务、API 网关和两个前端应用。

## 第一阶段：核心功能（MVP）

### 项目结构

```
wayfair-microservices/
├── api-gateway/                    # API 网关
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
│
├── services/                       # 微服务集群
│   ├── product-service/           # 产品管理
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── db/
│   │   │   ├── routers/
│   │   │   └── services/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   ├── user-service/              # 用户管理
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   ├── cart-service/              # 购物车
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   ├── order-service/             # 订单
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   ├── payment-service/           # 支付
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   ├── shipping-service/          # 物流
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── tsconfig.json
│   │
│   └── return-service/            # 退货
│       ├── src/
│       ├── package.json
│       ├── Dockerfile
│       └── tsconfig.json
│
├── frontends/                      # 前端应用
│   ├── storefront/                # 电商平台首页和购物
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx       # 首页
│   │   │   │   ├── Products.tsx   # 产品列表
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── Checkout.tsx
│   │   │   │   └── Account.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── Dockerfile
│   │
│   └── admin-panel/               # 商品管理中台
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Products.tsx
│       │   │   ├── ProductForm.tsx
│       │   │   ├── Orders.tsx
│       │   │   └── Analytics.tsx
│       │   ├── components/
│       │   └── App.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── Dockerfile
│
├── shared/                        # 共享库
│   ├── types.ts                  # 共享类型定义
│   ├── constants.ts              # 共享常量
│   ├── utils.ts                  # 共享工具函数
│   └── package.json
│
├── docker-compose.yml            # 本地开发环境
├── kubernetes/                   # K8s 配置（可选）
├── README.md
└── ARCHITECTURE.md
```

## 技术栈

### 后端
- **运行时**：Node.js 22
- **框架**：Express.js 4
- **API**：tRPC 11 + REST
- **数据库**：MySQL 8
- **ORM**：Drizzle ORM
- **缓存**：Redis
- **认证**：JWT + OAuth 2.0
- **支付**：Stripe SDK
- **容器化**：Docker
- **编程语言**：TypeScript

### 前端
- **框架**：React 19
- **样式**：Tailwind CSS 4
- **构建工具**：Vite
- **状态管理**：TanStack Query + Zustand
- **HTTP 客户端**：Axios
- **UI 组件**：shadcn/ui
- **表单**：React Hook Form
- **路由**：Wouter

### 基础设施
- **容器编排**：Docker Compose（开发）/ Kubernetes（生产）
- **云平台**：Google Cloud Platform
- **CI/CD**：Cloud Build
- **监控**：Prometheus + Grafana
- **日志**：ELK Stack

## 微服务详细设计

### 1. API 网关 (api-gateway)

**职责**：请求路由、认证、速率限制、日志记录

**主要功能**：
- 请求路由到各个微服务
- JWT 认证和授权
- 速率限制（Rate Limiting）
- 请求/响应日志
- CORS 处理
- 错误处理和转发

**端口**：3000

**环境变量**：
```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
PRODUCT_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
CART_SERVICE_URL=http://localhost:3003
ORDER_SERVICE_URL=http://localhost:3004
PAYMENT_SERVICE_URL=http://localhost:3005
SHIPPING_SERVICE_URL=http://localhost:3006
RETURN_SERVICE_URL=http://localhost:3007
```

---

### 2. 产品管理微服务 (product-service)

**职责**：商品信息、分类、库存、属性管理

**主要功能**：
- 商品 CRUD
- 商品分类管理
- 商品属性管理
- SKU 管理
- 库存管理
- 商品搜索和过滤
- 商品推荐

**数据库表**：
- products
- categories
- product_attributes
- product_skus
- inventory
- product_images

**端口**：3001

**API 端点**：
```
GET    /api/products              # 获取商品列表
POST   /api/products              # 创建商品
GET    /api/products/:id          # 获取商品详情
PUT    /api/products/:id          # 更新商品
DELETE /api/products/:id          # 删除商品
GET    /api/categories            # 获取分类
POST   /api/products/:id/images   # 上传商品图片
GET    /api/inventory/:skuId      # 获取库存
```

---

### 3. 用户管理微服务 (user-service)

**职责**：用户认证、授权、个人资料管理

**主要功能**：
- 用户注册和登录
- OAuth 集成
- 用户资料管理
- 地址簿管理
- 用户偏好设置
- 会员系统

**数据库表**：
- users
- user_profiles
- user_addresses
- user_preferences
- user_sessions

**端口**：3002

**API 端点**：
```
POST   /api/auth/register         # 用户注册
POST   /api/auth/login            # 用户登录
POST   /api/auth/logout           # 用户登出
GET    /api/users/:id             # 获取用户信息
PUT    /api/users/:id             # 更新用户信息
GET    /api/users/:id/addresses   # 获取地址列表
POST   /api/users/:id/addresses   # 添加地址
PUT    /api/users/:id/addresses/:addressId  # 更新地址
DELETE /api/users/:id/addresses/:addressId  # 删除地址
```

---

### 4. 购物车微服务 (cart-service)

**职责**：购物车管理和临时数据存储

**主要功能**：
- 购物车 CRUD
- 购物车持久化
- 购物车合并
- 库存检查
- 价格更新

**存储**：Redis（主要）+ MySQL（持久化）

**端口**：3003

**API 端点**：
```
POST   /api/carts                 # 创建购物车
GET    /api/carts/:id             # 获取购物车
POST   /api/carts/:id/items       # 添加商品
PUT    /api/carts/:id/items/:itemId  # 更新数量
DELETE /api/carts/:id/items/:itemId  # 删除商品
DELETE /api/carts/:id             # 清空购物车
```

---

### 5. 订单微服务 (order-service)

**职责**：订单创建、管理、追踪

**主要功能**：
- 订单创建
- 订单状态管理
- 订单追踪
- 订单取消
- 订单历史

**数据库表**：
- orders
- order_items
- order_status_history
- order_tracking

**端口**：3004

**API 端点**：
```
POST   /api/orders                # 创建订单
GET    /api/orders/:id            # 获取订单详情
GET    /api/orders                # 获取订单列表
PUT    /api/orders/:id/status     # 更新订单状态
POST   /api/orders/:id/cancel     # 取消订单
GET    /api/orders/:id/tracking   # 获取追踪信息
```

---

### 6. 支付微服务 (payment-service)

**职责**：支付处理、交易管理、对账

**主要功能**：
- Stripe 集成
- 支付意图创建
- 支付确认
- 退款处理
- 交易记录

**数据库表**：
- payments
- payment_transactions
- refunds

**端口**：3005

**API 端点**：
```
POST   /api/payments/intent       # 创建支付意图
POST   /api/payments/confirm      # 确认支付
POST   /api/payments/:id/refund   # 退款
GET    /api/payments/:id          # 获取支付信息
GET    /api/payments              # 支付列表
```

---

### 7. 物流微服务 (shipping-service)

**职责**：物流管理、运费计算、配送追踪

**主要功能**：
- 物流商集成
- 运费计算
- 配送地址验证
- 物流追踪
- 配送单生成

**数据库表**：
- shipping_methods
- shipping_rates
- shipments
- tracking_events

**端口**：3006

**API 端点**：
```
POST   /api/shipping/calculate    # 计算运费
POST   /api/shipping/create       # 创建配送单
GET    /api/shipping/:id/track    # 追踪物流
GET    /api/shipping/methods      # 获取物流方式
```

---

### 8. 退货微服务 (return-service)

**职责**：退货流程管理、退款处理

**主要功能**：
- 退货申请
- 退货审核
- 退货物流
- 退款处理
- 退货统计

**数据库表**：
- returns
- return_requests
- return_items
- return_tracking
- return_refunds

**端口**：3007

**API 端点**：
```
POST   /api/returns                # 申请退货
GET    /api/returns/:id            # 获取退货详情
PUT    /api/returns/:id/status     # 更新退货状态
GET    /api/returns/:id/tracking   # 获取退货追踪
POST   /api/returns/:id/refund     # 确认退款
```

---

## 前端应用设计

### Storefront（电商平台）

**首页 (Home)**：
- 导航菜单
- 搜索功能
- 轮播图/促销活动
- 产品分类展示
- 热销商品
- 新品推荐
- 品牌故事
- 页脚

**产品列表 (Products)**：
- 商品网格显示
- 分类过滤
- 价格范围过滤
- 排序选项
- 分页
- 搜索

**产品详情 (ProductDetail)**：
- 产品图片库
- 产品信息
- 价格和库存
- 属性选择（颜色、尺寸等）
- 数量选择
- 添加到购物车
- 相关产品推荐

**购物车 (Cart)**：
- 购物车项目列表
- 数量调整
- 删除项目
- 购物车总计
- 继续购物
- 结账按钮

**结账 (Checkout)**：
- 收货地址
- 物流方式选择
- 订单总计
- 支付方式选择
- 支付处理

**用户账户 (Account)**：
- 个人资料
- 订单历史
- 地址管理
- 偏好设置
- 登出

### Admin Panel（商品管理中台）

**仪表板 (Dashboard)**：
- 关键指标（销售额、订单数、用户数）
- 销售趋势图
- 最近订单
- 库存预警

**商品管理 (Products)**：
- 商品列表
- 创建商品
- 编辑商品
- 删除商品
- 批量操作

**商品表单 (ProductForm)**：
- 基本信息（名称、描述）
- 分类选择
- 属性配置
- SKU 管理
- 图片上传
- 价格设置
- 库存设置
- 发布/下架

**订单管理 (Orders)**：
- 订单列表
- 订单详情
- 订单状态更新
- 订单导出

**分析 (Analytics)**：
- 销售分析
- 用户分析
- 商品分析
- 自定义报表

---

## 开发步骤

### 第一步：创建项目结构和基础设施
1. 创建 Docker Compose 配置
2. 创建 MySQL 数据库初始化脚本
3. 创建 Redis 配置
4. 创建共享库 (shared)

### 第二步：实现 API 网关
1. 创建 Express 应用
2. 实现路由转发
3. 实现认证中间件
4. 实现错误处理

### 第三步：实现产品管理微服务
1. 创建数据库 schema
2. 创建 tRPC routers
3. 实现 CRUD 操作
4. 实现搜索和过滤

### 第四步：实现用户管理微服务
1. 创建用户表
2. 实现注册和登录
3. 实现 JWT 认证
4. 实现地址管理

### 第五步：实现购物车微服务
1. 配置 Redis
2. 实现购物车操作
3. 实现持久化
4. 实现库存检查

### 第六步：实现订单微服务
1. 创建订单表
2. 实现订单创建
3. 实现订单状态管理
4. 实现订单追踪

### 第七步：实现支付微服务
1. 集成 Stripe
2. 实现支付意图
3. 实现支付确认
4. 实现退款处理

### 第八步：实现物流微服务
1. 创建物流配置
2. 实现运费计算
3. 实现配送单生成
4. 实现追踪集成

### 第九步：实现退货微服务
1. 创建退货流程
2. 实现退货申请
3. 实现退款处理
4. 实现追踪

### 第十步：开发 Storefront 前端
1. 创建首页
2. 创建产品列表页
3. 创建产品详情页
4. 创建购物车页
5. 创建结账流程
6. 创建用户账户页

### 第十一步：开发 Admin Panel 前端
1. 创建仪表板
2. 创建商品管理页
3. 创建订单管理页
4. 创建分析页

### 第十二步：集成和测试
1. 微服务间集成测试
2. 前后端集成测试
3. 支付流程测试
4. 性能测试

### 第十三步：部署
1. 创建 Dockerfile
2. 配置 Cloud Build
3. 部署到 Cloud Run / GKE
4. 配置监控和日志

---

## 数据库设计

### 产品服务数据库 (product_db)
```sql
-- 产品表
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id BIGINT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id BIGINT
);

-- SKU 表
CREATE TABLE product_skus (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  sku_code VARCHAR(100) UNIQUE,
  attributes JSON,
  price DECIMAL(10, 2),
  stock INT DEFAULT 0
);

-- 库存表
CREATE TABLE inventory (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sku_id BIGINT NOT NULL,
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  available INT DEFAULT 0
);

-- 产品图片表
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(500),
  sort_order INT,
  is_main BOOLEAN DEFAULT FALSE
);
```

### 用户服务数据库 (user_db)
```sql
-- 用户表
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户地址表
CREATE TABLE user_addresses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type ENUM('shipping', 'billing'),
  street_address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE
);

-- 用户会话表
CREATE TABLE user_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(500),
  expires_at TIMESTAMP
);
```

### 订单服务数据库 (order_db)
```sql
-- 订单表
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(10, 2),
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 订单项目表
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT,
  sku_id BIGINT,
  quantity INT,
  price DECIMAL(10, 2)
);

-- 订单状态历史表
CREATE TABLE order_status_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 环境变量配置

### 共享环境变量
```
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=mysql://root:password@localhost:3306/wayfair
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### 服务特定环境变量
```
# API Gateway
API_GATEWAY_PORT=3000

# Product Service
PRODUCT_SERVICE_PORT=3001
PRODUCT_DB_NAME=product_db

# User Service
USER_SERVICE_PORT=3002
USER_DB_NAME=user_db

# ... 其他服务
```

---

## 本地开发运行

### 使用 Docker Compose
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

### 手动运行
```bash
# 启动 MySQL
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:8

# 启动 Redis
docker run -d -p 6379:6379 redis:latest

# 启动各个微服务
cd api-gateway && npm run dev
cd services/product-service && npm run dev
# ... 其他服务
```

---

## 部署到 Google Cloud Platform

### 步骤
1. 创建 GCP 项目
2. 配置 Cloud SQL（MySQL）
3. 配置 Cloud Memorystore（Redis）
4. 创建 Cloud Build 配置
5. 部署到 Cloud Run 或 GKE
6. 配置 Cloud Load Balancer
7. 配置 Cloud CDN

---

## 监控和日志

### 监控工具
- Google Cloud Monitoring
- Prometheus + Grafana

### 日志工具
- Google Cloud Logging
- ELK Stack

### 关键指标
- 请求延迟
- 错误率
- 吞吐量
- 数据库连接数
- 缓存命中率

---

## 下一步

1. 确认项目结构
2. 创建 Docker Compose 配置
3. 初始化 Git 仓库
4. 开始实现 API 网关
5. 逐步实现各个微服务

