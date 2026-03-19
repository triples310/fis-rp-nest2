/**
 * ERP UI Components
 * 統一導出所有 ERP 設計系統元件
 */

// 基礎元件
export { ErpBadge } from "./erp-badge";
export { ErpButton } from "./erp-button";
export { ErpInput } from "./erp-input";
export { ErpSelect } from "./erp-select";

// 卡片元件
export { ErpCard } from "./erp-card";
export { ErpKpiCard } from "./erp-kpi-card";

// 表格元件
export { ErpTableHeader, ErpTableCell } from "./table-cells";

// 對話框
export { ErpModal } from "./erp-modal";

// 布局元件
export { Row, STitle, Divider, FormRow } from "./layout";

// 其他
export { ComingSoon } from "./coming-soon";

// Re-export table components from shadcn
export { Table, TableBody, TableRow, TableHeader } from "@/components/ui/table";
