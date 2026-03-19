// Dashboard module types
// 定義此模組相關的所有 TypeScript 類型

/**
 * KPI 卡片數據類型
 */
export interface KpiData {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  color?: string;
}

/**
 * 儀表板數據類型
 */
export interface DashboardData {
  kpis: KpiData[];
  recentTransactions: Transaction[];
  expiringBatches: Batch[];
}

/**
 * 交易記錄類型
 */
export interface Transaction {
  id: string;
  type: string;
  sku: string;
  qty: number;
  unit: string;
  time: string;
  user: string;
}

/**
 * 批次類型
 */
export interface Batch {
  id: string;
  sku: string;
  batch: string;
  exp: string;
  days: number;
  qty: number;
  unit: string;
}
