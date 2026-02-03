FROM node:22-alpine

WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码
COPY src ./src
COPY tsconfig.json ./

# 构建
RUN pnpm build

# 暴露端口
EXPOSE 3003

# 启动应用
CMD ["pnpm", "start"]
