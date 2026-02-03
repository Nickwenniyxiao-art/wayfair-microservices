# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN pnpm run build

# 运行阶段
FROM node:20-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# 安装生产依赖
RUN pnpm install --no-frozen-lockfile --prod

# 从构建阶段复制构建结果
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3006

# 启动服务
CMD ["node", "dist/index.js"]
