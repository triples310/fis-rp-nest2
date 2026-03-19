# Seeder 使用指南

## 快速開始

### 執行 Seeder（手動）

```bash
# 在根目錄執行
npm run seed

# 或在 apps/backend 目錄執行
cd apps/backend
npm run seed
```

### 重置資料庫並自動執行 Seeder

```bash
# 在根目錄執行
npm run db:reset

# 或在 apps/backend 目錄執行
cd apps/backend
npx prisma migrate reset
```

---

## 執行結果

Seeder 會自動建立：

### 1. 權限（24 個）
- 使用者管理：`user.view`、`user.create`、`user.edit`、`user.delete`
- 角色管理：`role.view`、`role.create`、`role.edit`、`role.delete`
- 權限管理：`permission.view`、`permission.create`、`permission.edit`、`permission.delete`
- 模組管理：`module.view`、`module.manage`
- LIFF：`liff.stock.view`、`liff.order.view`
- 庫存：`stock.view`、`stock.edit`
- 採購：`purchase.view`、`purchase.create`、`purchase.edit`
- 訂單：`order.view`、`order.create`、`order.edit`

### 2. 角色（3 個）
- **admin** - 系統管理員（擁有所有權限）
- **staff** - 一般員工（基本查看權限）
- **warehouse** - 倉管人員（庫存管理權限）

### 3. 模組（7 個）
- dashboard - 儀表板
- stock - 庫存管理
- purchase - 採購管理
- order - 訂單管理
- production - 生產管理
- finance - 財務管理
- system - 系統設定

### 4. 管理員帳號（1 個）
- **Account**: `admin`
- **Password**: `123456`
- **角色**: admin（擁有所有權限）

---

## 常用指令

### 開發時修改 Seeder 內容

```bash
# 1. 完全重置資料庫（推薦）
npm run db:reset

# 會執行：
# - 刪除資料庫
# - 重新建立資料庫
# - 執行所有 migrations
# - 自動執行 seeder
```

### 只執行 Seeder（不重置資料庫）

```bash
# 適合資料庫已存在，只想補充資料
npm run seed

# 注意：
# - Seeder 有重複檢查機制
# - 已存在的資料不會重複建立
# - 只會新增缺少的資料
```

### 透過 API 執行（需要後端啟動）

```bash
# 1. 啟動後端
npm run dev:backend

# 2. 呼叫 API
curl -X POST http://localhost:3001/seeder/seed

# 或訪問 Swagger
# http://localhost:3001/api
# 找到 Seeder → POST /seeder/seed
```

---

## 檔案說明

### src/prisma/seed.ts
- **用途**：獨立的 seeder 執行腳本
- **可以**：直接透過 `npm run seed` 執行
- **不依賴**：不需要啟動 NestJS server

### src/seeder/seeder.service.ts
- **用途**：實際的 seeding 邏輯
- **可以**：被 `seed.ts` 呼叫，或透過 API 呼叫
- **優點**：可重複使用，支援多種執行方式

### API 端點：POST /seeder/seed
- **用途**：透過 API 執行 seeder
- **適合**：開發時快速測試，或部署後初始化
- **優點**：不需要 CLI 存取權限

---

## 修改 Seeder 內容

### 1. 編輯 SeederService

```typescript
// apps/backend/src/seeder/seeder.service.ts

async seedPermissions() {
  const permissions = [
    // ✅ 新增你的權限
    { code: 'product.view', name: '查看產品', module: 'product', type: 'action', description: '...' },
  ];
  
  for (const perm of permissions) {
    const existing = await this.prisma.permission.findUnique({
      where: { code: perm.code },
    });

    if (!existing) {
      await this.prisma.permission.create({ data: perm });
      console.log(`  ✓ 建立權限: ${perm.code}`);
    }
  }
}
```

### 2. 執行 Seeder

```bash
# 重置資料庫並重新執行
npm run db:reset

# 或只執行 seeder（會跳過已存在的資料）
npm run seed
```

---

## 重複執行的行為

Seeder 設計為**可安全重複執行**：

```typescript
// 每次建立前都會檢查
const existing = await this.prisma.permission.findUnique({
  where: { code: perm.code },
});

if (!existing) {
  // 只有不存在時才建立
  await this.prisma.permission.create({ data: perm });
}
```

**結果**：
- ✅ 已存在的權限 → 跳過
- ✅ 缺少的權限 → 新增
- ✅ 不會重複建立
- ✅ 不會報錯

---

## 生產環境部署

### 1. 執行 Migrations

```bash
cd apps/backend
npx prisma migrate deploy
```

### 2. 執行 Seeder

```bash
# 方法 A：透過 npm script
npm run seed

# 方法 B：透過 API（需要先啟動應用）
curl -X POST https://your-domain.com/seeder/seed
```

### 3. 修改預設密碼

```bash
# 登入後立即修改 admin 密碼！
# 預設帳號：admin
# 預設密碼：123456
```

---

## 故障排除

### 問題：`ts-node: command not found`

**解決**：
```bash
cd apps/backend
npm install
```

### 問題：`Cannot find module '@core/auth'`

**解決**：
```bash
# 確保有安裝 tsconfig-paths
npm install -D tsconfig-paths
```

### 問題：資料庫連線失敗

**解決**：
```bash
# 1. 確認 .env 檔案存在
cd apps/backend
cat .env | grep DATABASE_URL

# 2. 確認資料庫運行中
docker ps | grep postgres

# 3. 測試連線
npx prisma db push
```

---

## 相關指令總覽

| 指令 | 說明 | 位置 |
|------|------|------|
| `npm run seed` | 手動執行 seeder | 根目錄 / apps/backend |
| `npm run db:reset` | 重置資料庫並自動 seed | 根目錄 |
| `npx prisma migrate reset` | 重置資料庫並自動 seed | apps/backend |
| `npx prisma db seed` | 執行 seeder（Prisma 指令） | apps/backend |
| `POST /seeder/seed` | 透過 API 執行 | API 端點 |

---

**更新時間**: 2026-03-13  
**維護者**: Backend Team
