# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# 复制源代码
COPY src ./src
COPY tsconfig.json ./

# 构建
RUN pnpm build

# 生产阶段
FROM node:22-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./

# 只安装生产依赖
RUN pnpm install --no-frozen-lockfile --prod

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 启动应用
CMD ["node", "dist/index.js"]
