# symbolERP 功能需求與設計

本文件記錄 symbolERP 的核心功能需求、架構設計與實作規範。

---

## 1. JWT 認證處理

### 需求
- 從 Laravel 的 JWT 機制（tymon/jwt-auth）遷移到 NestJS
- 保留原有的 token payload 結構，降低前端改動成本
- 支援 token 產生、驗證、refresh

### 技術方案
**使用套件**：
- `@nestjs/jwt`：JWT token 產生與驗證
- `@nestjs/passport`：認證框架
- `passport-jwt`：JWT 策略

**實作重點**：
```typescript
// JWT payload 結構（與 Laravel 保持一致）
interface JwtPayload {
  sub: string;        // user ID
  email: string;
  role: string;       // 或 roles: string[]
  iat: number;
  exp: number;
}
```

**模組結構**：
```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── local-auth.guard.ts
└── dto/
    ├── login.dto.ts
    └── refresh-token.dto.ts
```

---

## 2. RBAC（角色權限控制）

### 需求
- 修復舊系統「角色設定菜單」功能損壞的問題
- 實作完整的 User → Role → Permission 架構
- 最高權限可控制「哪些角色能看到哪些菜單」
- 前端依 permissions 顯示/隱藏菜單與按鈕

### 資料表設計（Prisma Schema）

```prisma
model User {
  id          String     @id @default(uuid())
  email       String?    @unique
  password    String?    // bcrypt hash
  lineUserId  String?    @unique
  name        String
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  roles       UserRole[]
  
  @@map("users")
}

model Role {
  id          String           @id @default(uuid())
  name        String           @unique  // "admin", "staff", "warehouse"
  displayName String                   // "系統管理員", "員工", "倉管"
  description String?
  isActive    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  users       UserRole[]
  permissions RolePermission[]
  
  @@map("roles")
}

model Permission {
  id          String           @id @default(uuid())
  code        String           @unique  // "menu.stock.view", "menu.purchase.edit"
  name        String                   // "查看庫存菜單", "編輯採購"
  module      String                   // "stock", "purchase", "sale"
  type        String                   // "menu", "action"
  description String?
  createdAt   DateTime         @default(now())
  roles       RolePermission[]
  
  @@map("permissions")
}

model UserRole {
  userId    String
  roleId    String
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@id([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  createdAt    DateTime   @default(now())
  
  @@id([roleId, permissionId])
  @@map("role_permissions")
}
```

### API 設計

**登入後回傳格式**：
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "系統管理員",
    "roles": ["admin"],
    "permissions": [
      "menu.stock.view",
      "menu.stock.edit",
      "menu.purchase.view",
      "menu.order.view"
    ]
  }
}
```

**權限檢查（後端）**：
```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('menu.stock.edit')
@Get('stock')
getStock() { ... }
```

**前端使用**：
```typescript
// 依 permissions 顯示菜單
if (user.permissions.includes('menu.stock.view')) {
  // 顯示庫存菜單
}
```

---

## 3. LINE Login + LIFF 整合

### 需求
- ERP 員工可用「一般帳號密碼」或「LINE」登入後台
- 員工透過 LINE OA 選單 → LIFF 即時查看庫存、訂單

### 3.1 LINE Login（OAuth 2.0）

**流程**：
1. 前端顯示「LINE 登入」按鈕
2. 導向 `GET /auth/line` → 重定向到 LINE OAuth
3. LINE callback → `GET /auth/line/callback?code=xxx`
4. 後端用 code 換取 LINE user profile（user ID, name, email）
5. 檢查 `User.lineUserId`：
   - 已綁定 → 產生 JWT 並回傳
   - 未綁定 → 顯示「綁定現有帳號」或「建立新帳號」

**技術**：
- 套件：`passport-line` 或手動實作 OAuth flow
- 需要：LINE Developers 申請 Channel ID & Secret

### 3.2 LIFF（LINE Front-end Framework）

**架構**：
```
LINE OA 選單 
  → LIFF URL (https://yourdomain.com/liff/stock)
  → Next.js 頁面（admin-panel 或獨立 LIFF app）
  → liff.init() + liff.getProfile()
  → 呼叫後端 API：GET /api/liff/stock?lineUserId=xxx
  → 後端驗證 lineUserId 是否為員工
  → 回傳庫存資料
```

**後端 API**：
```typescript
@Get('liff/stock')
async getLiffStock(@Query('lineUserId') lineUserId: string) {
  const user = await this.userService.findByLineUserId(lineUserId);
  if (!user || !user.permissions.includes('menu.stock.view')) {
    throw new ForbiddenException();
  }
  return this.stockService.getStock();
}
```

---

## 4. 供應商前台（LINE OA + LIFF）

### 需求
- 供應商**不能**用一般帳號登入後台
- 供應商**只能**透過 LINE OA 登入前台（LIFF）
- 供應商可在前台查看訂單、接受/取消訂單
- ERP 員工在「採購管理 > 供應商管理」新增供應商並綁定 LINE

### 資料表設計

```prisma
model Supplier {
  id          String   @id @default(uuid())
  code        String   @unique      // 供應商編號
  name        String
  contactName String?
  phone       String?
  email       String?
  lineUserId  String?  @unique     // 綁定的 LINE user ID
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("suppliers")
}
```

### 流程設計

**1. 後台綁定**：
- 員工在「供應商管理」新增 Supplier
- 產生「綁定 QR code」→ 供應商掃碼 → 取得 LINE user ID → 更新 `Supplier.lineUserId`

**2. 供應商前台（LIFF）**：
```
LINE OA 選單 → LIFF (https://yourdomain.com/liff/supplier/orders)
→ liff.getProfile() → lineUserId
→ 呼叫 GET /api/supplier/orders?lineUserId=xxx
→ 後端驗證是否為已綁定的 Supplier
→ 回傳該供應商的採購單列表
```

**3. Flex Message 推送**：
- 新採購單建立時 → 後端用 LINE Messaging API 推送 Flex Message 給供應商
- 訊息內含「接受/取消」按鈕（postback action）
- 供應商點擊 → LINE 回傳 postback → 後端 webhook 更新訂單狀態

### API 設計

```typescript
// 供應商查看訂單
@Get('supplier/orders')
async getSupplierOrders(@Query('lineUserId') lineUserId: string) {
  const supplier = await this.supplierService.findByLineUserId(lineUserId);
  if (!supplier) throw new ForbiddenException('Supplier not found');
  return this.purchaseService.getOrdersBySupplier(supplier.id);
}

// 接受/取消訂單（來自 Flex Message postback）
@Post('supplier/orders/:id/accept')
async acceptOrder(@Param('id') orderId: string, @Body() body: { lineUserId: string }) {
  const supplier = await this.supplierService.findByLineUserId(body.lineUserId);
  if (!supplier) throw new ForbiddenException();
  return this.purchaseService.acceptOrder(orderId, supplier.id);
}
```

---

## 5. 模組啟用/停用控制

### 需求
- 最高權限可「啟用/停用」模組
- 停用時：菜單不顯示 或 置灰 + disabled（UX 可選）
- **不刪除資料**（與舊系統的「解除安裝」不同）

### 資料表設計

```prisma
model ModuleConfig {
  id          String   @id @default(uuid())
  code        String   @unique  // "stock", "purchase", "sale", "production"
  name        String              // "庫存管理", "採購管理", "銷售管理"
  description String?
  enabled     Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("module_configs")
}
```

### 行為設計

**1. 後端邏輯**：
- 每個 API 可加 `@CheckModule('stock')` decorator
- 若模組未啟用 → 回傳 403 Forbidden

```typescript
@CheckModule('stock')
@Get('stock')
getStock() { ... }
```

**2. 前端行為**（可選其一）：

**選項 A：完全隱藏**
```typescript
// 登入後取得 modules: [{ code: 'stock', enabled: true }, ...]
const menu = MENU.filter(m => 
  modules.find(mod => mod.code === m.moduleCode)?.enabled
);
```

**選項 B：置灰 + disabled**
```typescript
<Link 
  href={item.path} 
  className={cn(
    !item.enabled && 'opacity-50 pointer-events-none'
  )}
>
  {item.label}
  {!item.enabled && <Lock className="ml-2" />}
</Link>
```

### API 設計

```typescript
// 取得模組列表（含啟用狀態）
GET /api/modules
Response: [
  { code: "stock", name: "庫存管理", enabled: true },
  { code: "production", name: "生產管理", enabled: false }
]

// 更新模組狀態（僅最高權限）
PATCH /api/modules/:code
Body: { enabled: true }
```

---

## 6. 實作順序與優先級

### 階段 1：基礎架構（必須先完成）
1. ✅ Prisma Schema 定義（User, Role, Permission, Supplier, ModuleConfig）
2. ✅ PrismaService 設定
3. ✅ AuthModule 骨架（JWT + LocalStrategy）
4. ✅ RBAC Guards 與 Decorators

### 階段 2：核心認證（優先）
1. ⬜ 一般帳號登入（POST /auth/login）
2. ⬜ JWT 驗證與 refresh
3. ⬜ Role & Permission 查詢與綁定
4. ⬜ 登入回傳 user + roles + permissions

### 階段 3：LINE 整合
1. ⬜ LINE Login OAuth（GET /auth/line, /auth/line/callback）
2. ⬜ User 綁定 LINE（lineUserId）
3. ⬜ LIFF API（員工查庫存、訂單）

### 階段 4：供應商前台
1. ⬜ SupplierModule（CRUD + LINE 綁定）
2. ⬜ 供應商 LIFF API（查訂單）
3. ⬜ LINE Bot Webhook（接收 postback）
4. ⬜ Flex Message 推送（新訂單通知）

### 階段 5：模組控制
1. ⬜ ModuleConfigModule（CRUD）
2. ⬜ CheckModule Guard
3. ⬜ 前端依 enabled 顯示/隱藏菜單

---

## 附錄：相關檔案

- **移植約定**：`docs/LARAVEL_TO_NESTJS_MIGRATION.md`
- **API 文檔**：（建議用 Swagger 自動產生）
- **前端選單結構**：`apps/admin-panel/lib/data/menu.ts`

---

## 注意事項

1. **資料庫遷移**：Laravel migrations 需轉成 Prisma schema，再用 `prisma migrate dev` 建表
2. **密碼加密**：使用 `bcrypt`（與 Laravel 一致）
3. **環境變數**：LINE Channel ID/Secret、JWT Secret 等需加入 `.env`
4. **測試**：每個階段完成後需測試（單元測試 + E2E）
5. **文件更新**：API 變更需同步更新 Swagger 與此文件

---

**版本**：v1.0  
**最後更新**：2026-03-09
