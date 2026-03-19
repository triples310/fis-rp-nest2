/**
 * Inventory Module Types
 */

export interface InventoryItem {
  id: string;
  sku: string;
  batch: string;
  qty: number;
  unit: string;
  location: string;
}

export interface StockTransaction {
  id: string;
  type: 'in' | 'out' | 'adjust';
  sku: string;
  qty: number;
  timestamp: string;
}
