# Laravel → NestJS 移植約定（symbolERP）

做移植時請 @ 此檔案，依下列約定進行。

## 來源與目標

- **舊系統（Laravel）**：`/Users/emery/workplace/SymbolSturgeon/SymbolBackend`
- **新後端（NestJS）**：本專案 `apps/backend`（NestJS + Prisma）

## 原則

1. **不沿用 Laravel 的架構或模組**  
   不要照抄 Laravel 的 Modules、目錄結構。

2. **架構與模組依 NestJS 設計**  
   依領域/功能用 Nest 的 Module（Controller → Service → Prisma），命名與分層照 NestJS 慣例。

3. **只搬邏輯**  
   從 Laravel 移植的是「業務邏輯」：
   - Model 的查詢條件、關聯、`getData` 的篩選/排序/分頁
   - Job 的流程（建立/更新/刪除、計算、驗證）
   - 報表公式、價格計算等

4. **技術對應**
   - 用 **Prisma** 取代 Eloquent
   - 用 DTO + `class-validator` + `ValidationPipe` 取代 Laravel Request 驗證

## 使用方式

當你要從舊系統移植邏輯到新後端時，在對話中 **@ 此檔案**（例如 `@LARAVEL_TO_NESTJS_MIGRATION.md`），我就會依上述約定進行。
