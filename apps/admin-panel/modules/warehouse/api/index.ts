import { apiClient } from "@/lib/api-client";

export async function getLocations() {
  return apiClient.get('/api/warehouse/locations');
}
