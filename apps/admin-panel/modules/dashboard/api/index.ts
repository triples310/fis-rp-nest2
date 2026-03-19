import { apiClient } from "@/lib/api-client";
import type { DashboardData } from "../types";

/**
 * Dashboard API 客戶端
 * 所有與儀表板相關的 API 調用
 */

/**
 * 獲取儀表板數據
 */
export async function getDashboardData(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>('/api/dashboard');
  return response;
}

/**
 * 獲取近期交易
 */
export async function getRecentTransactions(limit: number = 20) {
  const response = await apiClient.get(`/api/dashboard/transactions?limit=${limit}`);
  return response;
}

/**
 * 獲取即將過期批次
 */
export async function getExpiringBatches(days: number = 30) {
  const response = await apiClient.get(`/api/dashboard/expiring-batches?days=${days}`);
  return response;
}

/**
 * 匯出數據為 CSV
 */
export async function exportDashboardData() {
  const response = await apiClient.get('/api/dashboard/export');
  return response;
}
