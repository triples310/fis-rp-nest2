# SymbolERP

企業資源規劃系統 (Enterprise Resource Planning System)

## 📋 專案簡介

SymbolERP 是一個現代化的 ERP 系統，採用 Monorepo 架構，包含前端管理面板和後端 API 服務。

### 技術棧

**Frontend (Admin Panel)**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- ShadCN UI
- Redux Toolkit

**Backend (API)**
- NestJS 11
- Prisma 7 (ORM)
- PostgreSQL 16
- TypeScript 5
- Node.js 24

**Infrastructure**
- Docker & Docker Compose
- PostgreSQL 16

---

## 🚀 快速開始

### 前置要求

- **Node.js**: v24.14.0+ (推薦使用 [nvm](https://github.com/nvm-sh/nvm))
- **npm**: v11.0.0+
- **Docker**: 最新版本 (如果使用 Docker 部署)
- **PostgreSQL**: 16+ (如果本機開發，可以自行選擇是否使用 Docker)

### 檢查版本

```bash
node --version  # 應該是 v24.14.0 或更高
npm --version   # 應該是 v11.0.0 或更高
docker --version
```

---

## ⚙️ 環境變數配置

本專案使用多層環境變數配置：

```
symbolERP/
├── .env                        # Docker 部署使用
├── .env.example                # 環境變數範本（可提交到 Git）
└── apps/
    ├── backend/
    │   └── .env                # Backend 本機開發使用
    └── admin-panel/
        └── .env                # Admin Panel 本機開發使用
```

### 1. 根目錄 `.env` (Docker 使用)

用於 Docker Compose 部署時的環境變數。

**複製範本並編輯：**

```bash
cp .env.example .env
```

**配置內容：**

```env
# PostgreSQL 資料庫設定
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password_here  # 請修改密碼
DB_DATABASE=symbolerp
DB_HOST=localhost
DB_PORT=5432

# Backend 設定
BACKEND_PORT=3001
NODE_ENV=development

# Admin Panel 設定
ADMIN_PANEL_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Docker 容器設定
CONTAINER_PREFIX=symbolerp
```

### 2. Backend `.env` (本機開發)

位置：`apps/backend/.env`

```env
# 資料庫連線
DATABASE_URL="postgresql://postgres:password@localhost:5432/symbolerp?schema=public"

# 應用程式設定
NODE_ENV=development
PORT=3001

# JWT 設定 (可選)
# JWT_SECRET=your_jwt_secret_here
# JWT_EXPIRES_IN=7d
```

### 3. Admin Panel `.env` (本機開發)

位置：`apps/admin-panel/.env`

```env
# API 端點
NEXT_PUBLIC_API_URL=http://localhost:3001

# 其他前端設定 (可選)
# NEXT_PUBLIC_APP_NAME=SymbolERP
# NEXT_PUBLIC_APP_VERSION=1.0.0
```

### ⚠️ 重要提醒

- ✅ `.env.example` - 可以提交到 Git（範本）
- ❌ `.env` - **絕對不要**提交到 Git（包含敏感資訊）
- ❌ `apps/backend/.env` - **絕對不要**提交到 Git
- ❌ `apps/admin-panel/.env` - **絕對不要**提交到 Git

---

## 🛠️ 安裝步驟

### 方式 1：本機開發（推薦用於開發）

#### 步驟 1：安裝依賴

```bash
# 安裝所有應用程式的依賴
npm run install:all

# 或分別安裝
cd apps/backend && npm install
cd apps/admin-panel && npm install
```

#### 步驟 2：配置環境變數

```bash
# 配置 Backend
cp apps/backend/.env.example apps/backend/.env
# 編輯 apps/backend/.env，修改資料庫連線資訊

# 配置 Admin Panel
cp apps/admin-panel/.env.example apps/admin-panel/.env
# 編輯 apps/admin-panel/.env，修改 API URL
```

#### 步驟 3：啟動 PostgreSQL

**選項 A：使用 Docker 啟動資料庫**

```bash
docker-compose up postgres -d
```

**選項 B：使用本機 PostgreSQL**

確保 PostgreSQL 已安裝並運行，然後創建資料庫：

```bash
psql -U postgres
CREATE DATABASE symbolerp;
\q
```

#### 步驟 4：初始化 Prisma

```bash
# 生成 Prisma Client
npm run prisma:generate

# 執行資料庫遷移
npm run prisma:migrate
```

#### 步驟 5：啟動開發伺服器

```bash
# 終端 1：啟動 Backend
npm run dev:backend

# 終端 2：啟動 Admin Panel
npm run dev:admin
```

#### 訪問應用程式

- **Admin Panel**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API 測試**: http://localhost:3001

---

### 方式 2：Docker 部署（推薦用於生產環境）

#### 步驟 1：配置環境變數

```bash
# 複製範本
cp .env.example .env

# 編輯 .env，修改密碼和其他設定
vim .env
```

#### 步驟 2：構建並啟動所有服務

```bash
# 構建並啟動（PostgreSQL + Backend + Admin Panel）
docker-compose up --build -d
```

#### 步驟 3：查看日誌

```bash
# 查看所有服務的日誌
docker-compose logs -f

# 只查看特定服務
docker-compose logs -f backend
docker-compose logs -f admin-panel
docker-compose logs -f postgres
```

#### 步驟 4：執行資料庫遷移（首次啟動）

```bash
# 進入 backend 容器
docker exec -it symbolerp-backend sh

# 執行 migration
npx prisma migrate deploy

# 退出容器
exit
```

#### 訪問應用程式

- **Admin Panel**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

#### 停止服務

```bash
# 停止所有服務
docker-compose down

# 停止並刪除資料卷（會清除資料庫資料）
docker-compose down -v
```

---

## 📝 常用指令

### 開發指令

```bash
# 安裝所有依賴
npm run install:all

# 啟動 Backend 開發伺服器
npm run dev:backend

# 啟動 Admin Panel 開發伺服器
npm run dev:admin

# 構建所有應用
npm run build

# 構建 Backend
npm run build:backend

# 構建 Admin Panel
npm run build:admin
```

### Prisma 資料庫指令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 創建並執行 migration
npm run prisma:migrate

# 開啟 Prisma Studio（資料庫視覺化工具）
npm run prisma:studio
```

### Docker 指令

```bash
# 啟動所有服務
docker-compose up -d

# 重新構建並啟動
docker-compose up --build -d

# 查看容器狀態
docker-compose ps

# 查看日誌
docker-compose logs -f

# 停止所有服務
docker-compose down

# 重啟特定服務
docker-compose restart backend
```

---

## 🗄️ 資料庫管理

### 使用 Prisma Studio（推薦）

```bash
npm run prisma:studio
```

訪問：http://localhost:5555

### 使用 psql

```bash
# 本機連接
psql -h localhost -p 5432 -U postgres -d symbolerp

# Docker 連接
docker exec -it symbolerp-postgres psql -U postgres -d symbolerp

# 常用 psql 指令
\dt              # 列出所有資料表
\d table_name    # 查看資料表結構
\q               # 退出
```

### 使用 GUI 工具

推薦工具：
- **DBeaver** (免費)
- **TablePlus** (付費)
- **pgAdmin** (免費)
- **DataGrip** (付費)

連接資訊：
- Host: `localhost`
- Port: `5432`
- Database: `symbolerp`
- Username: `postgres`
- Password: (見 `.env` 中的 `DB_PASSWORD`)

---

## 📁 專案結構

```
symbolERP/
├── apps/
│   ├── backend/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── prisma/            # Prisma Service & Module
│   │   │   ├── app.module.ts     # 主模組
│   │   │   ├── app.controller.ts # 控制器
│   │   │   └── main.ts            # 應用程式入口
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Prisma Schema
│   │   │   └── migrations/       # 資料庫遷移記錄
│   │   ├── prisma.config.ts      # Prisma 7 配置
│   │   ├── .env                   # Backend 環境變數
│   │   ├── Dockerfile             # Backend Docker 配置
│   │   └── package.json
│   │
│   └── admin-panel/               # Next.js Admin Panel
│       ├── app/                   # Next.js App Router
│       ├── components/            # React 元件
│       ├── lib/                   # 工具函式
│       ├── public/                # 靜態資源
│       ├── .env                   # Admin Panel 環境變數
│       ├── Dockerfile             # Admin Panel Docker 配置
│       └── package.json
│
├── .env                           # Docker 環境變數
├── .env.example                   # 環境變數範本
├── .gitignore                     # Git 忽略規則
├── docker-compose.yml             # Docker Compose 配置
├── package.json                   # 根目錄 package.json
└── README.md                      # 本文件
```

---

## 🔧 開發流程

### 1. 修改資料庫 Schema

```bash
# 編輯 Prisma Schema
vim apps/backend/prisma/schema.prisma

# 創建 migration
npm run prisma:migrate
# 輸入 migration 名稱，例如：add_user_table

# 生成 Prisma Client
npm run prisma:generate
```

### 2. 創建新的 API 端點

```bash
# 在 backend 目錄
cd apps/backend

# 使用 Nest CLI 生成資源
npx nest g resource users

# 這會創建：
# - users.module.ts
# - users.controller.ts
# - users.service.ts
# - users.entity.ts
# - dto/
```

### 3. 創建新的前端頁面

```bash
# 在 admin-panel 目錄
cd apps/admin-panel

# 創建新頁面（App Router）
mkdir -p app/users
touch app/users/page.tsx
```

---

## 🧪 測試

### Backend 測試

```bash
cd apps/backend

# 單元測試
npm run test

# E2E 測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov
```

### Admin Panel 測試

```bash
cd apps/admin-panel

# 運行測試（需要先配置）
npm run test
```

---

## 🚢 部署

### 生產環境部署檢查清單

- [ ] 修改所有密碼（資料庫、JWT 等）
- [ ] 設定 `NODE_ENV=production`
- [ ] 更新 `NEXT_PUBLIC_API_URL` 為實際域名
- [ ] 配置 HTTPS/SSL
- [ ] 設定防火牆規則
- [ ] 配置備份策略
- [ ] 設定日誌監控

### 使用 Docker Compose 部署

```bash
# 1. 配置生產環境變數
cp .env.example .env.production
vim .env.production

# 2. 使用生產環境配置啟動
docker-compose --env-file .env.production up -d

# 3. 執行資料庫遷移
docker exec -it symbolerp-backend npx prisma migrate deploy

# 4. 查看日誌確認啟動成功
docker-compose logs -f
```

---

## 🐛 故障排除

### Backend 無法啟動

```bash
# 檢查日誌
docker-compose logs backend

# 常見問題：
# 1. 資料庫連接失敗 → 檢查 DATABASE_URL
# 2. Port 被佔用 → 修改 BACKEND_PORT
# 3. Prisma Client 未生成 → 執行 npm run prisma:generate
```

### Admin Panel 無法連接 API

```bash
# 檢查環境變數
cat apps/admin-panel/.env

# 確認 NEXT_PUBLIC_API_URL 正確
# 本機開發：http://localhost:3001
# Docker：http://backend:3001 或 http://localhost:3001
```

### 資料庫連接問題

```bash
# 測試資料庫連接
psql -h localhost -p 5432 -U postgres -d symbolerp

# 檢查 PostgreSQL 是否運行
docker-compose ps postgres

# 重啟資料庫
docker-compose restart postgres
```

### Node.js 版本問題

Prisma 7 要求 Node.js 24.0+：

```bash
# 使用 nvm 切換版本
nvm install 24
nvm use 24
nvm alias default 24

# 驗證版本
node --version  # 應該顯示 v24.x.x
```

---

## 📚 相關文件

- [環境變數詳細說明](./ENV_VARIABLES.md)
- [Prisma 7 升級指南](./PRISMA_7_UPGRADE_COMPLETE.md)
- [專案結構遷移說明](./MIGRATION_TO_INDEPENDENT.md)

---

## 📖 技術文件

### Backend (NestJS)
- [NestJS 官方文件](https://docs.nestjs.com/)
- [Prisma 文件](https://www.prisma.io/docs)

### Frontend (Next.js)
- [Next.js 官方文件](https://nextjs.org/docs)
- [ShadCN UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Database
- [PostgreSQL 文件](https://www.postgresql.org/docs/)

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

## 📄 授權

ISC

---

## 👥 作者

SymbolERP Team
