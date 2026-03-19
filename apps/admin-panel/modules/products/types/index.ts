/**
 * Products Module Types
 * 產品模組相關類型定義
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  category: string;
  price: number;
  unit: string;
}

export interface BomItem {
  id: string;
  childSku: string;
  qty: number;
  unit: string;
}
