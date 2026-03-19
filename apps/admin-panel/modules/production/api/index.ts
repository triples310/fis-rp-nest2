import { apiClient } from "@/lib/api-client";

export async function getWorkOrders() {
  return apiClient.get('/api/work-orders');
}
