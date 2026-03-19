FROM node:20-alpine AS builder

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製所有原始碼
COPY . .

# 構建 Next.js 應用
RUN npm run build

# 生產階段
FROM node:20-alpine

WORKDIR /app

# 設定環境變數為生產模式
ENV NODE_ENV=production

# 複製 package.json
COPY package*.json ./

# 只安裝生產依賴
RUN npm ci --only=production

# 從 builder 複製構建結果
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 如果有 next.config.ts，也需要複製
COPY --from=builder /app/next.config.* ./

# 暴露 3000 port
EXPOSE 3000

# 啟動 Next.js 生產伺服器
CMD ["npm", "start"]