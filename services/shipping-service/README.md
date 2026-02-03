# Shipping Service

配送微服务，负责处理所有配送相关的业务逻辑，包括配送单创建、状态跟踪、费用计算等。

## 功能

- **创建配送单**: 为订单创建配送单并计算费用
- **状态跟踪**: 更新配送单状态并记录历史
- **费用计算**: 根据重量、地区计算配送费用
- **配送方式**: 管理多种配送方式和承运商
- **配送地区**: 管理不同地区的配送费用

## 技术栈

- Node.js + Express
- tRPC 用于 API
- MySQL 用于数据存储
- TypeScript 用于类型安全

## 数据库表

### shipments
- `id`: 配送单 ID
- `orderId`: 订单 ID
- `userId`: 用户 ID
- `status`: 配送状态 (pending, processing, shipped, in_transit, delivered, failed)
- `carrier`: 承运商
- `trackingNumber`: 追踪号
- `estimatedDelivery`: 预计送达时间
- `actualDelivery`: 实际送达时间
- `shippingAddress`: 收货地址
- `shippingCost`: 配送费用
- `weight`: 重量
- `dimensions`: 尺寸
- `notes`: 备注
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### shipmentHistory
- `id`: 历史记录 ID
- `shipmentId`: 配送单 ID
- `status`: 状态
- `location`: 位置
- `message`: 消息
- `timestamp`: 时间戳

### shippingMethods
- `id`: 配送方式 ID
- `name`: 名称
- `carrier`: 承运商
- `basePrice`: 基础价格
- `estimatedDays`: 预计天数
- `maxWeight`: 最大重量
- `isActive`: 是否激活

### shippingZones
- `id`: 地区 ID
- `name`: 名称
- `country`: 国家
- `state`: 州/省
- `zipCodeRange`: 邮编范围
- `multiplier`: 费用倍数

## API 端点

### tRPC 路由

#### `shipping.createShipment`
创建配送单

**请求参数**:
```typescript
{
  orderId: string;
  userId: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingMethodId: string;
  notes?: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    shipmentId: string;
    status: string;
    shippingCost: number;
    carrier: string;
    estimatedDelivery: string;
  };
  error?: string;
}
```

#### `shipping.updateShipmentStatus`
更新配送状态

**请求参数**:
```typescript
{
  shipmentId: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
  trackingNumber?: string;
  location?: string;
  message?: string;
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

#### `shipping.getShipment`
获取配送详情

**请求参数**:
```typescript
{
  shipmentId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: Shipment;
  error?: string;
}
```

#### `shipping.getOrderShipments`
获取订单的配送单

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
  data?: Shipment[];
  error?: string;
}
```

#### `shipping.getShipmentHistory`
获取配送历史

**请求参数**:
```typescript
{
  shipmentId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: ShipmentHistory[];
  error?: string;
}
```

#### `shipping.getShippingMethods`
获取所有配送方式

**响应**:
```typescript
{
  success: boolean;
  data?: ShippingMethod[];
  error?: string;
}
```

#### `shipping.calculateShippingCost`
计算配送费用

**请求参数**:
```typescript
{
  weight: number;
  country: string;
  state: string;
  shippingMethodId: string;
}
```

**响应**:
```typescript
{
  success: boolean;
  data?: {
    cost: number;
    carrier: string;
    estimatedDays: string;
  };
  error?: string;
}
```

#### `shipping.getUserShipments`
获取用户的所有配送单

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
  data?: Shipment[];
  error?: string;
}
```

## 环境变量

```env
# 服务配置
PORT=3006
LOG_LEVEL=info

# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=shipping_db
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
docker build -t shipping-service .

# 运行容器
docker run -p 3006:3006 \
  -e DB_HOST=mysql \
  shipping-service
```

## 集成

### 与 API Gateway 集成

API Gateway 会将配送相关的请求转发到此服务：

```
POST /api/shipments/create -> shipping.createShipment
PUT /api/shipments/:shipmentId/status -> shipping.updateShipmentStatus
GET /api/shipments/:shipmentId -> shipping.getShipment
GET /api/orders/:orderId/shipments -> shipping.getOrderShipments
GET /api/shipments/:shipmentId/history -> shipping.getShipmentHistory
GET /api/shipping-methods -> shipping.getShippingMethods
POST /api/shipping/calculate-cost -> shipping.calculateShippingCost
GET /api/users/:userId/shipments -> shipping.getUserShipments
```

### 与订单服务集成

订单创建后，需要调用此服务创建配送单。

## 配送费用计算

配送费用由以下因素决定：

1. **基础费用**: 根据配送方式
2. **地区倍数**: 根据收货地区调整
3. **重量费用**: 每磅 $0.50

```
总费用 = (基础费用 × 地区倍数) + (重量 × 0.50)
```

## 监控和日志

使用 Winston 记录所有操作：
- 配送单创建
- 状态更新
- 费用计算
- 错误信息

日志级别可通过 `LOG_LEVEL` 环境变量配置。
