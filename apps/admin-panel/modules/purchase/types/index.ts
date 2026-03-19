/**
 * Purchase Module Types
 */

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  items: PurchaseItem[];
  total: number;
  status: 'draft' | 'pending' | 'received';
}

export interface PurchaseItem {
  sku: string;
  qty: number;
  price: number;
}
