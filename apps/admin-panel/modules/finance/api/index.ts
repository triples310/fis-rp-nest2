import { apiClient } from "@/lib/api-client";

export async function getInvoices() {
  return apiClient.get('/api/invoices');
}

export async function createPayment(data: any) {
  return apiClient.post('/api/payments', data);
}
