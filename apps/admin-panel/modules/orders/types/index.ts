/**
 * Orders Module Types
 */

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed';
  createdAt: string;
}

export interface OrderItem {
  sku: string;
  qty: number;
  price: number;
}
