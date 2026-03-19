# 🚀 前端完整優化執行清單

## 📋 總覽

**預計總時間**: 8-12 小時  
**執行日期**: 2026-03-16  
**目標**: 完成所有短期、中期、長期優化任務

---

## ✅ Phase 1: 短期任務 (1.5 小時)

### 1.1 修復 TypeScript 錯誤 (30 分鐘)

#### 錯誤 1: `use-mobile` hook 缺失
- [ ] 創建 `hooks/use-mobile.ts`
```typescript
import { useEffect, useState } from 'react';

export function useMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
```

#### 錯誤 2: `api-client.ts` 類型問題
- [ ] 修復 `lib/api-client.ts` 第 37 行
```typescript
// Before
headers[AuthHeader] = `Bearer ${token}`;

// After
(headers as Record<string, string>)[AuthHeader] = `Bearer ${token}`;
```

#### 錯誤 3: `resizable.tsx` 導入問題
- [ ] 檢查 `react-resizable-panels` 版本
- [ ] 更新導入語句或降級套件
```bash
npm list react-resizable-panels
# 如果版本不對，重新安裝
npm install react-resizable-panels@latest
```

#### 錯誤 4: `chart.tsx` 類型問題
- [ ] 為 recharts 添加類型斷言
- [ ] 或暫時使用 `@ts-ignore` (記錄 TODO)

#### 驗證
- [ ] 執行 `npx tsc --noEmit` 確認 0 錯誤
- [ ] 記錄修復的內容

---

### 1.2 備份並刪除舊目錄 (15 分鐘)

#### 備份
- [ ] 創建備份目錄
```bash
mkdir -p backups/components-erp-backup-$(date +%Y%m%d)
```

- [ ] 備份以下目錄/文件:
  - [ ] `components/erp/` → backup
  - [ ] `lib/constants/erp-colors.ts` → backup

#### 刪除
- [ ] 刪除 `components/erp/ui/` 整個目錄
- [ ] 刪除 `components/erp/DashboardPages.tsx`
- [ ] 刪除 `components/erp/ProductPages.tsx`
- [ ] 刪除 `components/erp/InventoryPages.tsx`
- [ ] 刪除 `components/erp/OrderPages.tsx`
- [ ] 刪除 `components/erp/PurchasePages.tsx`
- [ ] 刪除 `components/erp/ProductionPages.tsx`
- [ ] 刪除 `components/erp/FinancePages.tsx`
- [ ] 刪除 `components/erp/WarehousePages.tsx`
- [ ] 刪除 `components/erp/SystemPages.tsx`
- [ ] 刪除 `components/erp/sidebar.tsx` 和 `topbar.tsx` (如果已移動)
- [ ] 刪除 `lib/constants/erp-colors.ts`
- [ ] 刪除空的 `components/erp/` 目錄

#### 驗證
- [ ] 執行 `npm run build` 確認編譯通過
- [ ] 檢查沒有遺漏的 import 錯誤

---

### 1.3 最終驗證 (15 分鐘)

- [ ] 執行 `npx tsc --noEmit`
- [ ] 執行 `npm run build`
- [ ] 檢查所有頁面路由
- [ ] Git commit: "chore: fix TypeScript errors and clean up old components"

---

## ✅ Phase 2: 中期任務 Part 1 - 組件遷移 ✅

**完成日期**: 2026-03-16  
**實際時間**: ~30 分鐘  
**詳細報告**: [PHASE_2_COMPLETE_REPORT.md](./PHASE_2_COMPLETE_REPORT.md)

**成果**:
- ✅ 所有 ErpBadge 和 ErpButton 已遷移為直接使用 Badge/Button variants
- ✅ 刪除 wrapper 組件 (erp-badge.tsx, erp-button.tsx)
- ✅ 代碼更標準化,完全使用 shadcn/ui
- ✅ 編譯通過 (僅剩 3 個 shadcn/ui 已知錯誤)

**統計**:
- 修改文件: 7 個
- 替換 ErpBadge: 9 次
- 替換 ErpButton: 2 次 + 移除 6 個未使用 import
- 刪除組件: 2 個

---

## Phase 2: 中期任務 Part 1 - 組件遷移 (2 小時)

### 2.1 準備工作 (15 分鐘)

- [ ] 統計 ErpBadge 使用次數
```bash
rg "ErpBadge" apps/admin-panel/modules --type tsx -c
```

- [ ] 統計 ErpButton 使用次數
```bash
rg "ErpButton" apps/admin-panel/modules --type tsx -c
```

- [ ] 創建遷移記錄檔案 `docs/COMPONENT_MIGRATION_LOG.md`

---

### 2.2 批量替換 ErpBadge (45 分鐘)

#### 模式 1: 簡單 label prop
- [ ] 搜尋並替換:
```typescript
// Pattern
<ErpBadge colorClass="COLOR" label="TEXT" />

// Replace with
<Badge variant="COLOR">TEXT</Badge>
```

#### 模式 2: 動態 label
- [ ] 搜尋並替換:
```typescript
// Pattern
<ErpBadge colorClass="COLOR" label={EXPRESSION} />

// Replace with
<Badge variant="COLOR">{EXPRESSION}</Badge>
```

#### 模式 3: 條件 colorClass
- [ ] 手動處理每個案例
```typescript
// Before
<ErpBadge 
  colorClass={status === "active" ? "erp-green" : "erp-red"} 
  label={status} 
/>

// After
<Badge variant={status === "active" ? "erp-green" : "erp-red" as any}>
  {status}
</Badge>
```

#### 需要處理的文件:
- [ ] `modules/dashboard/components/dashboard-pages.tsx`
- [ ] `modules/inventory/components/inventory-pages.tsx`
- [ ] `modules/purchase/components/purchase-pages.tsx`
- [ ] `modules/finance/components/finance-pages.tsx`
- [ ] `modules/system/components/system-pages.tsx`
- [ ] 其他包含 ErpBadge 的文件

#### 驗證每個文件
- [ ] 檢查編譯無誤
- [ ] 視覺測試 (打開瀏覽器檢查樣式)

---

### 2.3 批量替換 ErpButton (45 分鐘)

#### 模式 1: 普通按鈕
- [ ] 搜尋並替換:
```typescript
// Pattern
<ErpButton colorClass="COLOR">TEXT</ErpButton>

// Replace with
<Button variant="COLOR">TEXT</Button>
```

#### 模式 2: Ghost 按鈕
- [ ] 搜尋並替換:
```typescript
// Pattern
<ErpButton colorClass="COLOR" ghost>TEXT</ErpButton>

// Replace with
<Button variant="COLOR-ghost">TEXT</Button>
```

#### 模式 3: 帶 onClick
- [ ] 搜尋並替換:
```typescript
// Pattern
<ErpButton colorClass="COLOR" onClick={HANDLER}>TEXT</ErpButton>

// Replace with
<Button variant="COLOR" onClick={HANDLER}>TEXT</Button>
```

#### 需要處理的文件:
- [ ] `modules/dashboard/components/dashboard-pages.tsx`
- [ ] `modules/purchase/components/purchase-pages.tsx`
- [ ] `modules/production/components/production-pages.tsx`
- [ ] `modules/system/components/system-pages.tsx`
- [ ] 其他包含 ErpButton 的文件

#### 驗證每個文件
- [ ] 檢查編譯無誤
- [ ] 視覺測試所有按鈕

---

### 2.4 刪除 Wrapper 組件 (15 分鐘)

- [ ] 刪除 `components/erp-badge.tsx`
- [ ] 刪除 `components/erp-button.tsx`
- [ ] 更新所有 import 語句
- [ ] 最終編譯驗證

#### 驗證
- [ ] `npx tsc --noEmit` - 0 錯誤
- [ ] `npm run build` - 成功
- [ ] Git commit: "refactor: migrate ErpBadge/ErpButton to Badge/Button variants"

---

## ✅ Phase 3: 中期任務 Part 2 - 模組結構標準化 ✅

**完成日期**: 2026-03-16  
**實際時間**: ~30 分鐘  
**詳細報告**: [PHASE_3_COMPLETE_REPORT.md](./PHASE_3_COMPLETE_REPORT.md)

**成果**:
- ✅ 為 8 個核心模組創建完整標準化結構
- ✅ 創建 40 個 index.ts 文件 (api/, types/, hooks/, utils/, 模組根)
- ✅ Dashboard 作為完整範例 (~220 行代碼)
- ✅ 其他模組提供基礎結構和示例
- ✅ 創建完整的 modules/README.md 文檔
- ✅ 編譯通過 (僅剩 3 個 shadcn/ui 已知錯誤)

**標準結構**:
```
modules/[module-name]/
├── index.ts          # Barrel export
├── components/       # UI 組件
├── api/              # API 客戶端
├── types/            # TypeScript 類型
├── hooks/            # React Hooks
└── utils/            # 工具函數
```

**統計**:
- 創建文件: 40 個
- 新增代碼: ~800-1000 行
- 文檔: 1 個 README (200+ 行)

---

## Phase 3: 中期任務 Part 2 - 模組結構標準化 (2 小時)

### 3.1 創建標準目錄結構 (30 分鐘)

為每個模組創建以下結構:

```
modules/[module-name]/
├── components/     # 現有的頁面組件
├── hooks/          # 模組專屬 hooks
├── api/            # API 呼叫函式
├── types/          # TypeScript 類型定義
├── utils/          # 工具函式
└── constants/      # 常量定義
```

#### 執行腳本
- [ ] 為 9 個模組創建目錄:
```bash
modules=(dashboard products inventory orders purchase production finance warehouse system)
for module in "${modules[@]}"; do
  mkdir -p "modules/$module/"{hooks,api,types,utils,constants}
done
```

---

### 3.2 創建範例 Types 文件 (30 分鐘)

#### Dashboard
- [ ] 創建 `modules/dashboard/types/dashboard.types.ts`
```typescript
export interface KpiData {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  icon?: string;
}

export interface WarehouseCapacity {
  name: string;
  used: number;
  cap: number;
  temp: string;
  unit: string;
}

export interface DashboardData {
  kpis: KpiData[];
  warehouses: WarehouseCapacity[];
  expiring: any[]; // TODO: 定義 Batch 類型
}
```

#### Products
- [ ] 創建 `modules/products/types/products.types.ts`
```typescript
export interface BomItem {
  sku: string;
  qty: number;
  unit: string;
}

export type ProductType = "原料" | "半成品" | "庫存商品";

export interface Product {
  sku: string;
  name: string;
  barcode: string;
  type: ProductType;
  brand: string;
  temperature: string;
  unit: string;
  categories: string[];
  suppliers: string[];
  countries: string[];
  listPrice: number;
  sellPrice: number;
  bom: BomItem[];
  note: string;
}
```

#### 其他 7 個模組
- [ ] Inventory types
- [ ] Orders types  
- [ ] Purchase types
- [ ] Production types
- [ ] Finance types
- [ ] Warehouse types
- [ ] System types

---

### 3.3 創建範例 API 文件 (30 分鐘)

#### 通用 API 模板
- [ ] 創建 `lib/api/base-api.ts`
```typescript
import { apiClient } from '@/lib/api-client';

export class BaseApi<T> {
  constructor(private endpoint: string) {}

  async getAll() {
    return apiClient.get<T[]>(this.endpoint);
  }

  async getById(id: string) {
    return apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<T>) {
    return apiClient.post<T>(this.endpoint, data);
  }

  async update(id: string, data: Partial<T>) {
    return apiClient.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}
```

#### Products API
- [ ] 創建 `modules/products/api/products-api.ts`
```typescript
import { BaseApi } from '@/lib/api/base-api';
import { Product } from '../types/products.types';

export const productsApi = new BaseApi<Product>('/products');

// 額外的產品專屬 API
export const productsApiExtended = {
  ...productsApi,
  
  searchBySku: async (sku: string) => {
    return apiClient.get<Product[]>(`/products/search?sku=${sku}`);
  },
  
  getByType: async (type: string) => {
    return apiClient.get<Product[]>(`/products/type/${type}`);
  },
};
```

#### 其他模組的 API 文件
- [ ] Dashboard API
- [ ] Inventory API
- [ ] Orders API
- [ ] Purchase API
- [ ] Production API
- [ ] Finance API
- [ ] Warehouse API
- [ ] System API

---

### 3.4 創建範例 Hooks 文件 (30 分鐘)

#### 準備工作
- [ ] 安裝 React Query (如果還沒有)
```bash
npm install @tanstack/react-query
```

- [ ] 設置 QueryClient Provider (在 `app/layout.tsx`)

#### Products Hooks
- [ ] 創建 `modules/products/hooks/use-products.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products-api';
import { Product } from '../types/products.types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Product>) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

#### 其他模組的 Hooks
- [ ] Dashboard hooks
- [ ] Inventory hooks
- [ ] Orders hooks
- [ ] Purchase hooks
- [ ] Production hooks
- [ ] Finance hooks
- [ ] Warehouse hooks
- [ ] System hooks

---

## ✅ Phase 4: 長期任務 Part 1 - React Query 整合 (2-3 小時)

### 4.1 設置 React Query (30 分鐘)

#### Provider 設置
- [ ] 創建 `lib/query-client.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

- [ ] 更新 `app/layout.tsx`
```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';

// 在 return 中包裹
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

### 4.2 遷移 Products 頁面使用 React Query (1 小時)

- [ ] 更新 `modules/products/components/product-pages.tsx`
```typescript
// Before: 使用 useState
const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

// After: 使用 React Query
const { data: products = [], isLoading } = useProducts();
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();
```

- [ ] 更新所有 CRUD 操作
- [ ] 添加 loading states
- [ ] 添加 error handling
- [ ] 測試功能

---

### 4.3 遷移其他模組 (1-1.5 小時)

- [ ] Dashboard 頁面
- [ ] Inventory 頁面
- [ ] Purchase 頁面
- [ ] Finance 頁面
- [ ] System 頁面

#### 優先級
1. 高優先級: Products, Orders, Inventory
2. 中優先級: Purchase, Production, Warehouse
3. 低優先級: Dashboard, Finance, System

---

## ✅ Phase 5: 長期任務 Part 2 - Zustand 整合 (1.5 小時)

### 5.1 安裝和設置 Zustand (15 分鐘)

- [ ] 安裝 Zustand
```bash
npm install zustand
```

- [ ] 決定狀態管理策略
```
React Query 用於:
- 伺服器狀態 (API 資料)
- 快取管理
- 背景同步

Zustand 用於:
- UI 狀態 (側邊欄開關、主題等)
- 跨組件共享的客戶端狀態
- 表單草稿
```

---

### 5.2 創建 UI Store (30 分鐘)

- [ ] 創建 `lib/store/ui-store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  pageSize: number;
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setPageSize: (size: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      pageSize: 10,
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setPageSize: (size) => set({ pageSize: size }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

---

### 5.3 創建 Auth Store (45 分鐘)

- [ ] 創建 `lib/store/auth-store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

- [ ] 整合到現有的 `hooks/use-auth.tsx`
- [ ] 更新 API client 使用 auth store 的 token

---

## ✅ Phase 6: 長期任務 Part 3 - 統一 DataTable (2-3 小時)

### 6.1 分析現有表格 (30 分鐘)

- [ ] 列出所有表格使用的地方
- [ ] 分析共同特性:
  - [ ] 分頁
  - [ ] 排序
  - [ ] 篩選/搜尋
  - [ ] 選擇 (checkbox)
  - [ ] 行操作
  - [ ] 載入狀態
  - [ ] 空狀態

---

### 6.2 設計 DataTable API (30 分鐘)

- [ ] 創建 `components/data-display/data-table/types.ts`
```typescript
export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  
  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  
  // States
  loading?: boolean;
  error?: Error | null;
  
  // Styling
  className?: string;
  rowClassName?: (row: T) => string;
}
```

---

### 6.3 實作 DataTable 組件 (1.5 小時)

- [ ] 創建 `components/data-display/data-table/data-table.tsx`
- [ ] 實作基本表格結構
- [ ] 實作分頁功能
- [ ] 實作排序功能
- [ ] 實作選擇功能
- [ ] 實作搜尋功能
- [ ] 實作載入/錯誤/空狀態
- [ ] 添加 ERP 樣式支持

---

### 6.4 遷移一個頁面使用 DataTable (30 分鐘)

- [ ] 選擇 System Users 頁面作為範例
- [ ] 重構為使用 DataTable
- [ ] 測試所有功能
- [ ] 調整樣式確保零視覺變更

---

## ✅ Phase 7: 長期任務 Part 4 - API 串接準備 (1 小時)

### 7.1 API 文檔整理 (30 分鐘)

- [ ] 創建 `docs/API_ENDPOINTS.md`
- [ ] 列出所有需要的 API endpoints
- [ ] 定義請求/響應格式
- [ ] 定義錯誤處理規範

#### 範例格式
```markdown
## Products API

### GET /api/products
獲取產品列表

**Query Parameters:**
- type?: string - 產品類型
- search?: string - 搜尋關鍵字
- page?: number - 頁碼
- limit?: number - 每頁數量

**Response:**
{
  data: Product[],
  meta: {
    total: number,
    page: number,
    limit: number
  }
}
```

---

### 7.2 Mock API 設置 (30 分鐘)

- [ ] 決定使用 MSW (Mock Service Worker) 或其他方案
- [ ] 安裝 MSW
```bash
npm install -D msw
```

- [ ] 創建 mock handlers
```typescript
// lib/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { INITIAL_PRODUCTS } from './data';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({
      data: INITIAL_PRODUCTS,
      meta: { total: INITIAL_PRODUCTS.length }
    });
  }),
  
  // 其他 endpoints...
];
```

- [ ] 設置 MSW browser worker
- [ ] 在開發環境啟用

---

## ✅ Phase 8: 最終驗證和文檔 (1 小時)

### 8.1 完整測試 (30 分鐘)

#### 編譯測試
- [ ] `npx tsc --noEmit` - 確認 0 錯誤
- [ ] `npm run build` - 確認編譯成功
- [ ] `npm run lint` - 確認無 lint 錯誤

#### 功能測試
- [ ] 測試所有 9 個模組頁面
- [ ] 測試 CRUD 操作
- [ ] 測試分頁、排序、篩選
- [ ] 測試響應式佈局
- [ ] 測試深色/淺色模式

#### 視覺測試
- [ ] Dashboard 頁面
- [ ] Products 列表和編輯
- [ ] Inventory 各子頁面
- [ ] Orders 頁面
- [ ] Purchase 相關頁面
- [ ] 確認無視覺變化

---

### 8.2 性能檢查 (15 分鐘)

- [ ] 使用 Chrome DevTools 檢查:
  - [ ] Lighthouse 分數
  - [ ] Bundle size
  - [ ] 首屏載入時間
  - [ ] React Query devtools 檢查快取

- [ ] 記錄性能指標

---

### 8.3 更新文檔 (15 分鐘)

#### 更新現有文檔
- [ ] 更新 `FRONTEND_REFACTOR_COMPLETE.md`
  - 添加 Phase 2-8 完成記錄
  - 更新架構圖
  - 添加新的技術棧說明

- [ ] 創建 `docs/DEVELOPMENT_GUIDE.md`
```markdown
# 開發指南

## 技術棧
- Next.js 15
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Query
- Zustand

## 專案結構
...

## 開發流程
...

## 最佳實踐
...
```

- [ ] 創建 `docs/COMPONENT_LIBRARY.md`
  - 記錄所有可用組件
  - 使用範例
  - Props 說明

---

## ✅ Phase 9: Git 提交和發佈 (30 分鐘)

### 9.1 Git 提交策略

建議的 commit 順序:

```bash
# 1. 短期任務
git add .
git commit -m "fix: resolve TypeScript errors and clean up old components"

# 2. 組件遷移
git add .
git commit -m "refactor: migrate ErpBadge/ErpButton to Badge/Button variants"

# 3. 模組結構
git add .
git commit -m "feat: add standardized module structure with hooks, api, types"

# 4. React Query
git add .
git commit -m "feat: integrate React Query for data fetching"

# 5. Zustand
git add .
git commit -m "feat: add Zustand for UI and auth state management"

# 6. DataTable
git add .
git commit -m "feat: create unified DataTable component"

# 7. API 準備
git add .
git commit -m "feat: add API documentation and mock setup"

# 8. 文檔
git add .
git commit -m "docs: update documentation with complete refactor details"
```

---

### 9.2 創建發佈標籤

- [ ] 創建版本標籤
```bash
git tag -a v2.0.0 -m "Complete frontend architecture refactor"
git push origin v2.0.0
```

---

## 📊 檢查點和回滾計劃

### 重要檢查點

在以下階段完成後必須測試:

1. **Phase 1 完成後**
   - [ ] 編譯通過
   - [ ] 所有頁面可訪問
   - Git commit 作為安全點

2. **Phase 2 完成後**
   - [ ] 所有組件樣式正確
   - [ ] 無視覺變化
   - Git commit 作為安全點

3. **Phase 4 完成後**
   - [ ] React Query 運作正常
   - [ ] API 請求成功
   - Git commit 作為安全點

### 回滾方案

如果遇到問題:

```bash
# 查看最近的 commits
git log --oneline -10

# 回滾到特定 commit
git reset --hard <commit-hash>

# 或使用 git revert (保留歷史)
git revert <commit-hash>
```

---

## 🎯 成功標準

### 必須達成
- [ ] ✅ TypeScript 編譯 0 錯誤
- [ ] ✅ 所有頁面編譯成功
- [ ] ✅ 所有功能正常運作
- [ ] ✅ 無視覺變化
- [ ] ✅ React Query 正常運作
- [ ] ✅ Zustand stores 運作正常

### 可選達成
- [ ] 🎨 DataTable 在至少 3 個頁面使用
- [ ] 📚 完整的 API 文檔
- [ ] 🧪 MSW mock 設置完成
- [ ] 📖 開發指南文檔完整

---

## 💡 注意事項

### 重要提醒
1. **每個 Phase 完成後都要測試**
2. **遇到問題立即記錄**
3. **保持頻繁的 git commit**
4. **測試視覺效果避免樣式破壞**
5. **優先保證功能可用,優化可以後續**

### 時間管理
- 如果某個任務超過預估時間 50%,考慮:
  - 簡化實作
  - 拆分為更小的任務
  - 暫時跳過,標記為 TODO

### 調試技巧
```bash
# 快速檢查編譯錯誤
npx tsc --noEmit | grep "error TS"

# 快速檢查特定文件
npx tsc --noEmit path/to/file.tsx

# 檢查 unused imports
npm run lint -- --fix
```

---

## 📝 執行記錄

### 開始時間
- 開始: ___________
- 預計完成: ___________

### 完成進度

| Phase | 任務 | 狀態 | 耗時 | 備註 |
|-------|------|------|------|------|
| 1 | TypeScript 錯誤修復 | ⬜ | | |
| 1 | 清理舊目錄 | ⬜ | | |
| 2 | ErpBadge 遷移 | ⬜ | | |
| 2 | ErpButton 遷移 | ⬜ | | |
| 3 | 模組結構標準化 | ⬜ | | |
| 3 | Types 文件創建 | ⬜ | | |
| 3 | API 文件創建 | ⬜ | | |
| 3 | Hooks 文件創建 | ⬜ | | |
| 4 | React Query 設置 | ⬜ | | |
| 4 | Products 頁面遷移 | ⬜ | | |
| 4 | 其他頁面遷移 | ⬜ | | |
| 5 | Zustand 設置 | ⬜ | | |
| 5 | UI Store | ⬜ | | |
| 5 | Auth Store | ⬜ | | |
| 6 | DataTable 設計 | ⬜ | | |
| 6 | DataTable 實作 | ⬜ | | |
| 6 | DataTable 遷移 | ⬜ | | |
| 7 | API 文檔 | ⬜ | | |
| 7 | MSW 設置 | ⬜ | | |
| 8 | 完整測試 | ⬜ | | |
| 8 | 文檔更新 | ⬜ | | |
| 9 | Git 提交 | ⬜ | | |

### 遇到的問題

| 時間 | 問題描述 | 解決方案 | 狀態 |
|------|---------|---------|------|
| | | | |

---

## 🎉 完成!

恭喜完成所有優化任務!

### 下一步
- [ ] 通知團隊新的開發規範
- [ ] 分享文檔和最佳實踐
- [ ] 開始 API 串接實作
- [ ] 規劃下一階段功能開發

---

**最後更新**: 2026-03-16  
**版本**: 1.0.0  
**狀態**: 準備執行
