# 模組結構標準

## 📁 標準目錄結構

每個模組都應遵循以下標準結構:

```
modules/
  └── [module-name]/
      ├── index.ts              # Barrel export (統一導出)
      ├── components/           # UI 組件
      │   └── [name]-pages.tsx  # 主頁面組件
      ├── api/                  # API 客戶端
      │   └── index.ts          # API 函數
      ├── types/                # TypeScript 類型
      │   └── index.ts          # 類型定義
      ├── hooks/                # React Hooks
      │   └── index.ts          # 自定義 hooks
      └── utils/                # 工具函數
          └── index.ts          # 工具函數
```

---

## 🎯 各目錄職責

### `/components`
- 存放該模組的所有 UI 組件
- 主要包含頁面組件 (`*-pages.tsx`)
- 可包含子組件 (如 `product-card.tsx`, `product-form.tsx`)

### `/api`
- 所有 API 調用函數
- 使用統一的 `apiClient`
- 包含 CRUD 操作和特殊 API

**範例**:
```typescript
import { apiClient } from "@/lib/api-client";

export async function getProducts() {
  return apiClient.get('/api/products');
}

export async function createProduct(data: ProductFormData) {
  return apiClient.post('/api/products', data);
}
```

### `/types`
- 模組相關的所有 TypeScript 類型定義
- 包含數據模型、表單數據、API 回應等

**範例**:
```typescript
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
}

export interface ProductFormData {
  sku: string;
  name: string;
  price: number;
}
```

### `/hooks`
- 自定義 React Hooks
- 封裝狀態邏輯、副作用、數據獲取等

**範例**:
```typescript
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}
```

### `/utils`
- 工具函數和輔助函數
- 純函數,無副作用
- 可複用的業務邏輯

**範例**:
```typescript
export function formatPrice(price: number): string {
  return `NT$${price.toLocaleString()}`;
}

export function validateSku(sku: string): boolean {
  return /^[A-Z0-9-]+$/.test(sku);
}
```

### `/index.ts` (Barrel Export)
- 統一導出模組的所有公開 API
- 簡化外部引用

**範例**:
```typescript
export * from "./components/product-pages";
export * from "./api";
export * from "./types";
export * from "./hooks";
export * from "./utils";
```

---

## 📦 使用方式

### 內部引用 (模組內)
```typescript
// 在模組內部,使用相對路徑
import { getProducts } from "../api";
import type { Product } from "../types";
import { formatPrice } from "../utils";
```

### 外部引用 (其他模組或頁面)
```typescript
// 從模組根目錄引用 (推薦)
import { Product, getProducts, useProducts, formatPrice } from "@/modules/products";

// 或從具體子目錄引用
import { Product } from "@/modules/products/types";
import { getProducts } from "@/modules/products/api";
```

---

## 🌟 最佳實踐

### 1. **單一職責**
每個文件應該有明確的職責,不要混雜不同類型的代碼。

### 2. **命名規範**
- 組件: PascalCase (`ProductCard.tsx`)
- 函數: camelCase (`getProducts`, `formatPrice`)
- 類型: PascalCase (`Product`, `ProductFormData`)
- 常量: UPPER_SNAKE_CASE (`MAX_ITEMS`)

### 3. **類型優先**
- 所有 API 函數都應該有類型標註
- 使用 TypeScript 嚴格模式
- 避免使用 `any`

### 4. **文檔註釋**
為公開的函數和類型添加 JSDoc 註釋:
```typescript
/**
 * 獲取所有產品列表
 * @returns 產品數組
 */
export async function getProducts(): Promise<Product[]> {
  // ...
}
```

### 5. **錯誤處理**
API 函數應該適當處理錯誤:
```typescript
export async function getProducts() {
  try {
    return await apiClient.get('/api/products');
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}
```

---

## 📋 當前已實現模組

以下模組已按照標準結構實現:

- ✅ **dashboard** - 儀表板 (完整範例)
- ✅ **products** - 產品管理
- ✅ **inventory** - 庫存管理
- ✅ **orders** - 訂單管理
- ✅ **purchase** - 採購管理
- ✅ **production** - 生產管理
- ✅ **finance** - 財務管理
- ✅ **warehouse** - 倉庫管理
- ⏭️ **auth** - 認證 (已有基礎結構)
- ⏭️ **system** - 系統管理 (特殊結構)

---

## 🔄 遷移指南

### 從舊結構遷移到新結構

1. **識別功能** - 確定代碼屬於哪個模組
2. **分類代碼** - 將代碼分類到 api/, types/, hooks/, utils/
3. **創建文件** - 在對應目錄創建文件
4. **更新引用** - 更新所有 import 路徑
5. **測試** - 確保功能正常

### 添加新功能

1. **確定類型** - 判斷是 API、Hook、Utils 還是 Component
2. **創建文件** - 在對應目錄創建或修改文件
3. **導出** - 在 `index.ts` 中導出 (如果是公開 API)
4. **文檔** - 添加適當的註釋

---

## 📖 參考範例

### 完整範例: Dashboard 模組

查看 `modules/dashboard/` 目錄以獲取完整的實現範例,包括:
- 完整的類型定義
- API 函數實現
- 自定義 Hooks
- 工具函數
- 完整的 JSDoc 文檔

### 簡化範例: 其他模組

其他模組提供了基礎結構和最小實現,可以根據實際需求擴展。

---

**更新日期**: 2026-03-16  
**維護者**: Frontend Team
