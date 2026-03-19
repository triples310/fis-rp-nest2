/**
 * Dashboard 工具函數
 */

/**
 * 格式化日期時間
 * @param date - 日期字符串或對象
 * @returns 格式化後的字符串
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 計算剩餘天數
 * @param expiryDate - 到期日期
 * @returns 剩餘天數
 */
export function calculateDaysRemaining(expiryDate: string | Date): number {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 格式化數字
 * @param num - 數字
 * @param decimals - 小數位數
 * @returns 格式化後的字符串
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 匯出數據為 CSV
 * @param data - 數據數組
 * @param filename - 文件名
 */
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
