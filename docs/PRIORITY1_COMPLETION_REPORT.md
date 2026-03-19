# 優先級 1：Role & Permission 管理模組 + Seeder - 完成報告

## ✅ 已完成項目

### 1. Roles 模組
- ✅ `RolesModule`、`RolesService`、`RolesController`
- ✅ CRUD API：
  - `POST /roles` - 建立新角色
  - `GET /roles` - 取得所有角色（含權限與使用者關聯）
  - `GET /roles/:id` - 取得單一角色
  - `PATCH /roles/:id` - 更新角色
  - `DELETE /roles/:id` - 停用角色（軟刪除）
  - `POST /roles/:id/permissions` - 為角色分配權限
  - `DELETE /roles/:roleId/permissions/:permissionId` - 移除角色的權限
- ✅ 權限保護：所有 API 均需要 JWT + 相應權限（如 `role.view`、`role.create` 等）
- ✅ Swagger 文檔完整

### 2. Permissions 模組
- ✅ `PermissionsModule`、`PermissionsService`、`PermissionsController`
- ✅ CRUD API：
  - `POST /permissions` - 建立新權限
  - `GET /permissions` - 取得所有權限
  - `GET /permissions?module=xxx` - 依模組過濾權限
  - `GET /permissions/:id` - 取得單一權限
  - `PATCH /permissions/:id` - 更新權限
  - `DELETE /permissions/:id` - 刪除權限（會連帶刪除 RolePermission 關聯）
- ✅ 權限保護：所有 API 均需要 JWT + 相應權限
- ✅ Swagger 文檔完整

### 3. Seeder 模組
- ✅ `SeederModule`、`SeederService`、`SeederController`
- ✅ 初始化內容：
  - **24 個預設權限**（user、role、permission、module、liff、stock、purchase、order）
  - **3 個預設角色**：
    - `admin` - 系統管理員（擁有所有權限）
    - `staff` - 一般員工（基本查看權限）
    - `warehouse` - 倉管人員（庫存管理權限）
  - **7 個預設模組**：dashboard、stock、purchase、order、production、finance、system
  - **1 個管理員帳號**：
    - Email: `admin@symbol.com`
    - Password: `admin123456`
    - 角色: `admin`
- ✅ API：`POST /seeder/seed` - 執行初始化（可重複執行，已存在的資料不會重複建立）

### 4. AppModule 整合
- ✅ 將 `RolesModule`、`PermissionsModule`、`SeederModule` 加入 `AppModule`

---

## 🧪 測試結果

### 1. Seeder 初始化
```bash
curl -X POST http://localhost:3001/seeder/seed
```
✅ **成功**：返回管理員帳號資訊

### 2. 登入測試
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@symbol.com","password":"admin123456"}'
```
✅ **成功**：返回 JWT token 和使用者資訊（含所有 24 個權限）

### 3. Roles API 測試
```bash
curl -X GET http://localhost:3001/roles \
  -H "Authorization: Bearer <token>"
```
✅ **成功**：返回 3 個角色（admin、staff、warehouse）及其關聯的權限與使用者

### 4. Permissions API 測試
```bash
# 取得所有權限
curl -X GET http://localhost:3001/permissions \
  -H "Authorization: Bearer <token>"
```
✅ **成功**：返回 24 個權限

```bash
# 依模組過濾
curl -X GET "http://localhost:3001/permissions?module=user" \
  -H "Authorization: Bearer <token>"
```
✅ **成功**：返回 4 個 user 模組的權限（user.view、user.create、user.edit、user.delete）

---

## 📝 使用說明

### 首次部署或重置資料庫時

1. **啟動後端**：
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **執行 Seeder**：
   ```bash
   curl -X POST http://localhost:3001/seeder/seed
   ```

3. **使用管理員帳號登入**：
   - Email: `admin@symbol.com`
   - Password: `admin123456`

4. **測試 API**（需要攜帶 JWT token）：
   - Swagger 文檔：`http://localhost:3001/api`
   - 可以在 Swagger 中點擊 "Authorize" 輸入 Bearer token 進行測試

---

## 📚 API 文檔

所有 API 已整合到 Swagger，訪問 `http://localhost:3001/api` 查看完整文檔。

主要 API 分類：
- **Auth** - 登入、驗證、LINE 登入
- **Users** - 使用者管理（員工帳號）
- **Roles** - 角色管理
- **Permissions** - 權限管理
- **Modules** - 模組控制（啟用/停用）
- **LIFF** - LINE LIFF 相關功能
- **Seeder** - 資料初始化

---

## 🎯 下一步建議

根據優先級清單，接下來可以進行：

### 優先級 2（前端整合）
1. **JWT Refresh Token 機制**（後端）
2. **前端整合 Auth Context**
3. **前端 RBAC 整合**（依權限控制菜單顯示）
4. **前端管理頁面**：
   - 使用者管理
   - 角色管理
   - 權限管理
   - 模組控制

### 優先級 3（業務模組移植）
從舊 Laravel 系統移植核心業務邏輯到新 NestJS 系統。

---

## 📌 注意事項

1. **權限系統已完整實作**：所有 CRUD API 都受 `JwtAuthGuard` + `PermissionGuard` 保護
2. **Seeder 可重複執行**：不會重複建立已存在的資料
3. **預設密碼請修改**：生產環境部署時，請立即修改 `admin@symbol.com` 的密碼
4. **模組擴展**：未來新增業務模組時，記得在 Seeder 中新增對應的權限

---

**完成時間**：2026-03-12
**狀態**：✅ 測試通過，可投入使用
