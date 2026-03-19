/**
 * Production Module Types
 */

export interface WorkOrder {
  id: string;
  productSku: string;
  qty: number;
  status: 'scheduled' | 'in_progress' | 'completed';
}
