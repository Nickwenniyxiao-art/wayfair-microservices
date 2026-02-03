# Payment Service

支付微服务，负责处理所有支付相关的业务逻辑，包括支付意向创建、支付确认、退款处理等。集成 Stripe 支付网关。

## 功能

- **支付意向创建**: 为订单创建 Stripe Payment Intent
- **支付确认**: 确认支付状态并更新订单
- **退款处理**: 处理全额或部分退款
- **支付历史**: 记录所有支付交易历史
- **Webhook 处理**: 处理 Stripe Webhook 事件

## 技术栈

- Node.js + Express
- tRPC 用于 API
- MySQL 用于数据存储
- Stripe 用于支付处理
- TypeScript 用于类型安全

## 数据库表

### payments
- `id`: 支付 ID
- `orderId`: 订单 ID
- `userId`: 用户 ID
- `amount`: 支付金额
- `currency`: 货币
- `status`: 支付状态 (pending, processing, completed, failed, refunded)
- `paymentMethod`: 支付方式
- `stripePaymentIntentId`: Stripe Payment Intent ID
- `stripeChargeId`: Stripe Charge ID
- `metadata`: 元数据
- `errorMessage`: 错误信息
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### refunds
- `id`: 退款 ID
- `paymentId`: 支付 ID
- `orderId`: 订单 ID
- `amount`: 退款金额
- `reason`: 退款原因
- `status`: 退款状态 (pending, completed, failed)
- `stripeRefundId`: Stripe Refund ID
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### paymentHistory
- `id`: 历史记录 ID
- `paymentId`: 支付 ID
- `status`: 状态
- `message`: 消息
- `createdAt`: 创建时间

## API 端点

### tRPC 路由

#### `payment.createPaymentIntent`
创建支付意向

**请求参数**:
```typescript
{
  orderId: string;
  userId: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    paymentId: string;
    clientSecret: string;
    stripePaymentIntentId: string;
  };
  error?: string;
}
```

#### `payment.confirmPayment`
确认支付

**请求参数**:
```typescript
{
  paymentId: string;
  stripePaymentIntentId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    success: boolean;
    status: string;
  };
  error?: string;
}
```

#### `payment.getPayment`
获取支付详情

**请求参数**:
```typescript
{
  paymentId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Payment;
  error?: string;
}
```

#### `payment.createRefund`
创建退款

**请求参数**:
```typescript
{
  paymentId: string;
  orderId: string;
  amount: number;
  reason?: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    refundId: string;
    stripeRefundId: string;
    status: string;
  };
  error?: string;
}
```

#### `payment.getRefund`
获取退款详情

**请求参数**:
```typescript
{
  refundId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Refund;
  error?: string;
}
```

#### `payment.getOrderPayments`
获取订单的支付列表

**请求参数**:
```typescript
{
  orderId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Payment[];
  error?: string;
}
```

## 环境变量

```env
# 服务配置
PORT=3005
LOG_LEVEL=info

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=payment_db

# Stripe 配置
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建
pnpm run build

# 启动
pnpm run start

# 测试
pnpm run test
```

## Docker

```bash
# 构建镜像
docker build -t payment-service .

# 运行容器
docker run -p 3005:3005 \
  -e STRIPE_SECRET_KEY=sk_test_... \
  -e DB_HOST=mysql \
  payment-service
```

## 集成

### 与 API Gateway 集成

API Gateway 会将支付相关的请求转发到此服务：

```
POST /api/payments/create-intent -> payment.createPaymentIntent
POST /api/payments/confirm -> payment.confirmPayment
GET /api/payments/:paymentId -> payment.getPayment
POST /api/payments/:paymentId/refund -> payment.createRefund
GET /api/refunds/:refundId -> payment.getRefund
GET /api/orders/:orderId/payments -> payment.getOrderPayments
```

### 与订单服务集成

支付完成后，需要通知订单服务更新订单状态。

## 安全性

- 所有支付数据都通过 HTTPS 传输
- Stripe API Key 存储在环境变量中
- Webhook 签名验证确保请求来自 Stripe
- 支付金额验证防止欺诈

## 错误处理

服务返回标准的错误响应格式：

```typescript
{
  success: false;
  error: string;
}
```

常见错误：
- `Payment not found`: 支付记录不存在
- `Can only refund completed payments`: 只能退款已完成的支付
- `Refund amount exceeds payment amount`: 退款金额超过支付金额
- Stripe API 错误

## 监控和日志

使用 Winston 记录所有操作：
- 支付意向创建
- 支付确认
- 退款处理
- Webhook 事件
- 错误信息

日志级别可通过 `LOG_LEVEL` 环境变量配置。
