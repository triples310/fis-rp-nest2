import { useState, useEffect } from "react";
import { getDashboardData } from "../api";
import type { DashboardData } from "../types";

/**
 * Dashboard 模組的自定義 Hooks
 */

/**
 * 使用儀表板數據
 * @returns Dashboard 數據和加載狀態
 */
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * 使用數據過濾
 * @param data - 原始數據
 * @param filterType - 過濾類型
 * @returns 過濾後的數據
 */
export function useDataFilter<T>(data: T[], filterType: string) {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    if (filterType === "all") {
      setFilteredData(data);
    } else {
      // 根據 filterType 實現過濾邏輯
      setFilteredData(data);
    }
  }, [data, filterType]);

  return filteredData;
}
