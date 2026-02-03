# Return Service

退货微服务，负责处理所有退货和退款相关的业务逻辑，包括退货请求、审批、状态跟踪和退款处理。

## 功能

- **创建退货请求**: 用户提交退货请求
- **审批退货**: 管理员审批或拒绝退货请求
- **状态跟踪**: 跟踪退货物流状态
- **退款处理**: 计算和处理退款
- **退货政策**: 管理退货政策和条件
- **退货原因**: 管理退货原因分类

## 技术栈

- Node.js + Express
- tRPC 用于 API
- MySQL 用于数据存储
- TypeScript 用于类型安全

## 数据库表

### returns
- `id`: 退货 ID
- `orderId`: 订单 ID
- `userId`: 用户 ID
- `status`: 退货状态 (requested, approved, rejected, shipped, received, refunded)
- `reason`: 退货原因
- `description`: 退货描述
- `refundAmount`: 退款金额
- `refundStatus`: 退款状态 (pending, processing, completed, failed)
- `returnAddress`: 退货地址
- `trackingNumber`: 追踪号
- `images`: 产品图片
- `notes`: 备注
- `requestedAt`: 请求时间
- `approvedAt`: 批准时间
- `shippedAt`: 发货时间
- `receivedAt`: 收货时间
- `refundedAt`: 退款时间
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### returnHistory
- `id`: 历史记录 ID
- `returnId`: 退货 ID
- `status`: 状态
- `message`: 消息
- `createdBy`: 创建者
- `createdAt`: 创建时间

### returnReasons
- `id`: 原因 ID
- `code`: 代码
- `name`: 名称
- `description`: 描述
- `isActive`: 是否激活

### returnPolicies
- `id`: 政策 ID
- `name`: 名称
- `description`: 描述
- `returnWindow`: 退货窗口（例如 "30 days"）
- `refundPercentage`: 退款百分比
- `restockingFee`: 重新上架费
- `isActive`: 是否激活

## API 端点

### tRPC 路由

#### `return.createReturnRequest`
创建退货请求

**请求参数**:
```typescript
{
  orderId: string;
  userId: string;
  reason: string;
  description?: string;
  refundAmount: number;
  images?: string[];
  notes?: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    returnId: string;
    status: string;
    refundAmount: number;
  };
  error?: string;
}
```

#### `return.approveReturn`
批准退货请求

**请求参数**:
```typescript
{
  returnId: string;
  returnAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
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

#### `return.rejectReturn`
拒绝退货请求

**请求参数**:
```typescript
{
  returnId: string;
  reason: string;
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

#### `return.updateReturnStatus`
更新退货状态

**请求参数**:
```typescript
{
  returnId: string;
  status: 'shipped' | 'received' | 'refunded';
  trackingNumber?: string;
  notes?: string;
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

#### `return.getReturn`
获取退货详情

**请求参数**:
```typescript
{
  returnId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Return;
  error?: string;
}
```

#### `return.getOrderReturns`
获取订单的退货列表

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
  data?: Return[];
  error?: string;
}
```

#### `return.getUserReturns`
获取用户的退货列表

**请求参数**:
```typescript
{
  userId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Return[];
  error?: string;
}
```

#### `return.getReturnHistory`
获取退货历史

**请求参数**:
```typescript
{
  returnId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: ReturnHistory[];
  error?: string;
}
```

#### `return.getReturnReasons`
获取所有退货原因

**响应**:
```typescript
{
  success: boolean;
  data?: ReturnReason[];
  error?: string;
}
```

#### `return.getReturnPolicies`
获取退货政策

**响应**:
```typescript
{
  success: boolean;
  data?: ReturnPolicy[];
  error?: string;
}
```

#### `return.calculateRefundAmount`
计算退款金额

**请求参数**:
```typescript
{
  originalAmount: number;
  returnReason: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    originalAmount: number;
    refundAmount: number;
    refundPercentage: number;
    restockingFee: number;
  };
  error?: string;
}
```

## 环境变量

```env
# 服务配置
PORT=3007
LOG_LEVEL=info

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=return_db
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
docker build -t return-service .

# 运行容器
docker run -p 3007:3007 \
  -e DB_HOST=mysql \
  return-service
```

## 集成

### 与 API Gateway 集成

API Gateway 会将退货相关的请求转发到此服务：

```
POST /api/returns/request -> return.createReturnRequest
POST /api/returns/:returnId/approve -> return.approveReturn
POST /api/returns/:returnId/reject -> return.rejectReturn
PUT /api/returns/:returnId/status -> return.updateReturnStatus
GET /api/returns/:returnId -> return.getReturn
GET /api/orders/:orderId/returns -> return.getOrderReturns
GET /api/users/:userId/returns -> return.getUserReturns
GET /api/returns/:returnId/history -> return.getReturnHistory
GET /api/return-reasons -> return.getReturnReasons
GET /api/return-policies -> return.getReturnPolicies
POST /api/returns/calculate-refund -> return.calculateRefundAmount
```

### 与支付服务集成

退款处理需要与支付服务集成以处理退款。

## 退款计算

退款金额由以下因素决定：

1. **退款百分比**: 根据退货政策
2. **重新上架费**: 根据退货政策

```
退款金额 = (原始金额 × 退款百分比 / 100) - 重新上架费
```

## 监控和日志

使用 Winston 记录所有操作：
- 退货请求创建
- 退货审批
- 状态更新
- 退款计算
- 错误信息

日志级别可通过 `LOG_LEVEL` 环境变量配置。
