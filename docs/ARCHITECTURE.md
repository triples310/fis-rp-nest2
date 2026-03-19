# symbolERP Backend 架構說明

## 目錄結構

```
src/
├── core/                           # 核心基礎設施（被所有業務模組依賴）
│   ├── auth/                       # 認證與授權
│   │   ├── guards/                 # Auth 專屬 Guards (JWT, Local, LINE)
│   │   ├── strategies/             # Passport 策略
│   │   ├── dto/                    # 資料傳輸物件
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                      # 使用者管理
│   ├── roles/                      # 角色管理
│   ├── permissions/                # 權限管理
│   └── module-config/              # 模組配置管理（功能開關）
│
├── modules/                        # 業務邏輯模組
│   ├── liff/                       # LINE LIFF 整合
│   └── [future]                    # 未來業務模組
│       ├── stock/                  # 庫存管理
│       ├── purchase/               # 採購管理
│       ├── order/                  # 訂單管理
│       ├── production/             # 生產管理
│       ├── finance/                # 財務管理
│       └── product/                # 產品管理
│
├── shared/                         # 跨模組共用工具（無特定業務邏輯）
│   ├── decorators/                 # 共用裝飾器
│   │   ├── current-user.decorator.ts
│   │   ├── require-permission.decorator.ts
│   │   └── check-module.decorator.ts
│   └── guards/                     # 共用 Guards
│       ├── permission.guard.ts
│       └── check-module.guard.ts
│
├── prisma/                         # 資料庫 ORM（全域依賴）
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── seeder/                         # 資料初始化（開發工具）
│   ├── seeder.service.ts
│   ├── seeder.controller.ts
│   └── seeder.module.ts
│
├── app.module.ts                   # 根模組
└── main.ts                         # 應用程式入口
```

---

## 架構原則

### 1. 分層職責

#### Core（核心層）
- **定義**：提供橫跨所有業務模組的基礎功能
- **特點**：
  - 被 `modules/` 中的業務模組依賴
  - 高度穩定，很少變動
  - 包含：認證、授權、使用者、角色、權限管理
- **範例**：
  ```typescript
  // modules/stock/stock.controller.ts
  import { JwtAuthGuard } from '@core/auth/guards';
  import { PermissionGuard } from '@shared/guards';
  ```

#### Modules（業務層）
- **定義**：實際的業務邏輯模組
- **特點**：
  - 依賴 `core/` 和 `shared/`
  - 可獨立開發、測試、部署
  - 每個模組負責一個領域（DDD）
- **範例**：`stock/`、`purchase/`、`order/`

#### Shared（共用層）
- **定義**：跨模組的通用工具和輔助功能
- **特點**：
  - 無特定業務邏輯
  - 完全通用，所有模組都可使用
  - 包含：裝飾器、Guards、Pipes、Interceptors、Filters
- **範例**：
  ```typescript
  // @CurrentUser() - 所有模組都用
  // @RequirePermission() - 所有模組都用
  // CheckModuleGuard - 檢查模組是否啟用
  ```

#### Prisma & Seeder（根目錄層）
- **定義**：資料庫 ORM 與資料初始化工具
- **特點**：
  - `prisma/` - 全域依賴，所有模組都需要
  - `seeder/` - 開發工具，僅在初始化時使用
  - 直接放在 `src/` 根目錄，符合 NestJS 官方慣例
- **範例**：
  ```typescript
  // 使用相對路徑 import
  import { PrismaService } from '../../prisma/prisma.service';
  ```

---

### 2. 依賴關係

```
modules/          依賴→  core/
                  依賴→  shared/
                  依賴→  prisma/

core/             依賴→  shared/
                  依賴→  prisma/

shared/           依賴→  core/ (僅 CheckModuleGuard 依賴 ModuleConfigService)

prisma/           依賴→  無（完全獨立）
seeder/           依賴→  prisma/
```

**禁止的依賴**：
- ❌ `core/` 依賴 `modules/`（核心不應依賴業務）
- ❌ `prisma/` 依賴任何層（資料庫層必須獨立）

---

### 3. Import 路徑約定

#### Path Aliases（用於跨層級 import）

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/core/*"],
      "@modules/*": ["src/modules/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

**使用範例**：
```typescript
// ✅ 使用 Path Alias（跨層級）
import { JwtAuthGuard } from '@core/auth/guards';
import { CurrentUser } from '@shared/decorators';
import { ModuleConfigService } from '@core/module-config/module-config.service';

// ✅ 使用相對路徑（同層級或 prisma）
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';

// ❌ 不要混用（保持一致性）
import { JwtAuthGuard } from '../../core/auth/guards'; // 應使用 @core
```

#### Prisma 的 Import 規則

由於 `prisma/` 在 `src/` 根目錄，**統一使用相對路徑**：

```typescript
// core/auth/auth.module.ts（深度 2）
import { PrismaModule } from '../../prisma/prisma.module';

// core/auth/strategies/jwt.strategy.ts（深度 3）
import { PrismaService } from '../../../prisma/prisma.service';

// modules/liff/liff.service.ts（深度 2）
import { PrismaService } from '../../prisma/prisma.service';

// app.module.ts（深度 0）
import { PrismaModule } from './prisma/prisma.module';
```

---

## 模組命名約定

### Core 模組
- 使用完整名稱：`AuthModule`、`UsersModule`、`RolesModule`
- 目錄名稱：小寫 + 短橫線（`auth/`、`users/`、`roles/`）
- 特例：`module-config/` → `ModuleConfigModule`（避免與 `modules/` 目錄混淆）

### Business 模組
- 使用業務名稱：`StockModule`、`PurchaseModule`、`OrderModule`
- 目錄名稱：小寫 + 短橫線（`stock/`、`purchase/`、`order/`）

---

## Guards 與 Decorators 的分層

### Auth 專屬（在 `core/auth/guards/`）
- `JwtAuthGuard` - JWT 驗證
- `LocalAuthGuard` - 本地帳密驗證
- `LineAuthGuard` - LINE Login 驗證

### 共用（在 `shared/guards/` 和 `shared/decorators/`）
- `PermissionGuard` - 權限檢查
- `CheckModuleGuard` - 模組啟用檢查
- `@CurrentUser()` - 取得當前使用者
- `@RequirePermission()` - 權限裝飾器
- `@CheckModule()` - 模組檢查裝飾器

### 業務專屬（在各 `modules/*/guards/`）
- 例如：`OrderOwnerGuard`（訂單擁有者檢查）
- 例如：`StockManagerGuard`（庫存管理員檢查）

---

## 新增業務模組的步驟

### 1. 建立模組目錄
```bash
mkdir src/modules/stock
cd src/modules/stock
```

### 2. 建立模組檔案
```
stock/
├── dto/
│   ├── create-stock.dto.ts
│   └── update-stock.dto.ts
├── stock.controller.ts
├── stock.service.ts
└── stock.module.ts
```

### 3. 模組模板
```typescript
// stock.module.ts
import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '@infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
```

### 4. 加入 AppModule
```typescript
// app.module.ts
import { StockModule } from '@modules/stock/stock.module';

@Module({
  imports: [
    // ...
    StockModule,
  ],
})
export class AppModule {}
```

---

## Prisma 的特殊地位

### 為什麼 Prisma 在 src/ 根目錄？

1. **全域依賴**：所有模組都直接依賴 `PrismaService`
2. **符合 NestJS 官方慣例**：[官方文檔](https://docs.nestjs.com/recipes/prisma) 也是這樣組織
3. **Import 路徑簡潔**：`../../prisma` 比 `@infrastructure/prisma` 更直觀
4. **不是「可選基礎設施」**：Prisma 是核心依賴，無法替換

### Seeder 的特殊地位

- **開發工具**：僅在初始化/重置時使用
- **不是運行時依賴**：生產環境可以不包含
- **與 Prisma 平級**：都屬於資料庫相關工具

---

## 與 Laravel 移植的對應關係

```
Laravel                          NestJS
─────────────────────────────────────────────────────
App/Http/Controllers/
├── AuthController               → @core/auth/
├── UserController               → @core/users/
├── RoleController               → @core/roles/
└── PermissionController         → @core/permissions/

App/Http/Controllers/
├── StockController              → @modules/stock/
├── PurchaseController           → @modules/purchase/
└── OrderController              → @modules/order/

App/Http/Middleware/
├── Authenticate                 → @core/auth/guards/JwtAuthGuard
└── CheckPermission              → @shared/guards/PermissionGuard
```

---

## 測試策略

### 單元測試
```typescript
// stock.service.spec.ts
import { StockService } from './stock.service';
import { PrismaService } from '@infrastructure/prisma/prisma.service';
```

### E2E 測試
```typescript
// stock.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
```

---

## 常見問題 (FAQ)

### Q: 為什麼要用 `module-config` 而不是 `modules`？
**A**: 避免與目錄 `modules/` 混淆。`module-config` 明確表示「模組配置管理」的用途。

### Q: 什麼時候放在 `shared/`，什麼時候放在模組內部？
**A**:
- **shared/**：所有模組都會用到的通用功能（如 `@CurrentUser()`）
- **模組內部**：僅該模組使用的功能（如 `OrderOwnerGuard`）

### Q: `core/` 和 `shared/` 有什麼區別？
**A**:
- **core/**：有業務語意的核心功能（Auth、Users、Roles）
- **shared/**：無業務語意的通用工具（Decorators、Guards、Pipes）

### Q: 可以讓 `modules/` 中的模組互相依賴嗎？
**A**: 盡量避免。如果確實需要，考慮：
1. 將共用邏輯提升到 `core/`
2. 使用事件驅動架構（Event Emitter）
3. 明確定義依賴方向，避免循環依賴

---

## 延伸閱讀

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Domain-Driven Design (DDD)](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**版本**: v1.0  
**最後更新**: 2026-03-12  
**維護者**: Backend Team
