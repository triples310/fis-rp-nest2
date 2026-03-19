/**
 * Menu Structure with Routes
 * 選單結構與路由對照表
 */

import {
  LayoutDashboard, ShoppingCart, Package, Warehouse, Building2,
  Truck, Factory, DollarSign, Settings,
  BarChart3, AlertTriangle, ScrollText,
  List, Shuffle, MapPin,
  PackageSearch, FileText, ClipboardList, GitBranch, Layers,
  ScanBarcode, PackageCheck, ArrowRightLeft, Printer, RotateCcw,
  ClipboardCheck, Lightbulb, Users2,
  Cog, HardDrive, UserCog, KeyRound, Activity, Plug,
  Receipt, PieChart,
  type LucideIcon,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;  // Next.js route
}

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  colorClass: string;
  sub: SubMenuItem[];
}

export interface FlatSubItem extends SubMenuItem {
  parentId: string;
  parentColorClass: string;
  parentLabel: string;
}

export const MENU: MenuItem[] = [
  { 
    id: "dashboard", 
    icon: LayoutDashboard, 
    label: "儀表板", 
    colorClass: "erp-cyan", 
    sub: [
      { id: "dash_overview", label: "多倉庫存總覽", icon: BarChart3, path: "/dashboard" },
      { id: "dash_expiry", label: "效期預警看板", icon: AlertTriangle, path: "/dashboard/expiry" },
      { id: "dash_txn", label: "今日異動 Log", icon: ScrollText, path: "/dashboard/transactions" },
    ]
  },
  { 
    id: "product", 
    icon: Package, 
    label: "商品主檔", 
    colorClass: "erp-orange", 
    sub: [
      { id: "prod_list", label: "商品主檔", icon: PackageSearch, path: "/products" },
    ]
  },
  { 
    id: "order", 
    icon: ShoppingCart, 
    label: "訂單管理", 
    colorClass: "erp-blue", 
    sub: [
      { id: "order_list", label: "訂單管理", icon: List, path: "/orders" },
    ]
  },
  { 
    id: "purchase", 
    icon: Truck, 
    label: "採購管理", 
    colorClass: "erp-yellow", 
    sub: [
      { id: "po_list", label: "採購單列表", icon: FileText, path: "/purchase" },
      { id: "po_qc", label: "進貨驗收 QC", icon: ClipboardCheck, path: "/purchase/qc" },
      { id: "po_suggest", label: "採購建議", icon: Lightbulb, path: "/purchase/suggest" },
      { id: "po_vendor", label: "供應商管理", icon: Users2, path: "/purchase/vendor" },
    ]
  },
  { 
    id: "warehouse", 
    icon: Building2, 
    label: "倉儲作業", 
    colorClass: "erp-green", 
    sub: [
      { id: "wh_inbound", label: "入庫掃碼", icon: ScanBarcode, path: "/warehouse/inbound" },
      { id: "wh_outbound", label: "出庫揀貨", icon: PackageCheck, path: "/warehouse/outbound" },
      { id: "wh_transfer", label: "調撥移倉", icon: ArrowRightLeft, path: "/warehouse/transfer" },
      { id: "wh_label", label: "標籤列印", icon: Printer, path: "/warehouse/label" },
      { id: "wh_rma", label: "退貨/RMA 入庫", icon: RotateCcw, path: "/warehouse/rma" },
    ]
  },
  { 
    id: "production", 
    icon: Factory, 
    label: "生產管理", 
    colorClass: "erp-red", 
    sub: [
      { id: "wo_material", label: "投料作業", icon: Cog, path: "/production/material" },
      { id: "wo_sort", label: "加工分色入庫", icon: Layers, path: "/production/sort" },
      { id: "wo_output", label: "成品報工", icon: PackageCheck, path: "/production/output" },
      { id: "wo_scrap", label: "餘料回庫", icon: RotateCcw, path: "/production/scrap" },
    ]
  },
  { 
    id: "inventory", 
    icon: Warehouse, 
    label: "庫存管理", 
    colorClass: "erp-purple", 
    sub: [
      { id: "inv_batch", label: "批號查詢", icon: ScanBarcode, path: "/inventory/batch" },
      { id: "inv_txn", label: "庫存異動日誌", icon: ScrollText, path: "/inventory/transactions" },
      { id: "inv_expiry", label: "效期管理", icon: AlertTriangle, path: "/inventory/expiry" },
      { id: "inv_trace", label: "溯源查詢", icon: GitBranch, path: "/inventory/trace" },
      { id: "inv_adjust", label: "庫存調整單", icon: ClipboardList, path: "/inventory/adjust" },
    ]
  },
  { 
    id: "finance", 
    icon: DollarSign, 
    label: "財務管理", 
    colorClass: "erp-finance", 
    sub: [
      { id: "fin_ap", label: "應付帳款 AP", icon: Receipt, path: "/finance/ap" },
      { id: "fin_cost", label: "進銷存成本表", icon: FileText, path: "/finance/cost" },
      { id: "fin_pl", label: "損益分析", icon: PieChart, path: "/finance/pl" },
    ]
  },
  { 
    id: "system", 
    icon: Settings, 
    label: "系統設定", 
    colorClass: "muted-foreground", 
    sub: [
      { id: "sys_account", label: "帳號設定", icon: UserCog, path: "/system/account" },
      { id: "sys_module", label: "模組設定", icon: Cog, path: "/system/module" },
    ]
  },
];

// 扁平化的選單項對照表
export const flatSub: Record<string, FlatSubItem> = {};
MENU.forEach(m => {
  m.sub.forEach(s => {
    flatSub[s.id] = { ...s, parentId: m.id, parentColorClass: m.colorClass, parentLabel: m.label };
  });
});

// 路徑反查選單項（用於根據路徑判斷當前頁面）
export const pathToMenuItem: Record<string, string> = {};
MENU.forEach(m => {
  m.sub.forEach(s => {
    pathToMenuItem[s.path] = s.id;
  });
});
