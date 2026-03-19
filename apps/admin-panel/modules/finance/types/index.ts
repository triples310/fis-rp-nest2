/**
 * Finance Module Types
 */

export interface Invoice {
  id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
}
