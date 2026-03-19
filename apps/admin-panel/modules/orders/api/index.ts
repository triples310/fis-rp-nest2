import { apiClient } from "@/lib/api-client";

export async function getOrders() {
  return apiClient.get('/api/orders');
}

export async function createOrder(data: any) {
  return apiClient.post('/api/orders', data);
}
