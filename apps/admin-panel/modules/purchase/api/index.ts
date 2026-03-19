import { apiClient } from "@/lib/api-client";

export async function getPurchaseOrders() {
  return apiClient.get('/api/purchase-orders');
}

export async function createPurchaseOrder(data: any) {
  return apiClient.post('/api/purchase-orders', data);
}
