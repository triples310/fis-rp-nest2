import { apiClient } from "@/lib/api-client";

export async function getInventory() {
  return apiClient.get('/api/inventory');
}

export async function getStockByLocation(location: string) {
  return apiClient.get(`/api/inventory/location/${location}`);
}
