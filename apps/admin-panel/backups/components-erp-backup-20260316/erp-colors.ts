/**
 * ERP 色彩對照表與工具函式
 */

// 文字色彩對照
export const ERP_COLOR_TEXT: Record<string, string> = {
  "erp-cyan": "text-erp-cyan",
  "erp-blue": "text-erp-blue",
  "erp-yellow": "text-erp-yellow",
  "erp-red": "text-erp-red",
  "erp-green": "text-erp-green",
  "erp-purple": "text-erp-purple",
  "erp-orange": "text-erp-orange",
  "erp-finance": "text-erp-finance",
  "muted-foreground": "text-muted-foreground",
};

// Badge 樣式對照
export const ERP_BADGE_STYLES: Record<string, string> = {
  "erp-cyan": "bg-erp-cyan/15 text-erp-cyan border-erp-cyan/30",
  "erp-blue": "bg-erp-blue/15 text-erp-blue border-erp-blue/30",
  "erp-yellow": "bg-erp-yellow/15 text-erp-yellow border-erp-yellow/30",
  "erp-red": "bg-erp-red/15 text-erp-red border-erp-red/30",
  "erp-green": "bg-erp-green/15 text-erp-green border-erp-green/30",
  "erp-purple": "bg-erp-purple/15 text-erp-purple border-erp-purple/30",
  "erp-orange": "bg-erp-orange/15 text-erp-orange border-erp-orange/30",
  "erp-finance": "bg-erp-finance/15 text-erp-finance border-erp-finance/30",
  "muted-foreground": "bg-muted text-muted-foreground border-border",
};

// Button 樣式對照
export const ERP_BTN_STYLES: Record<string, { normal: string; ghost: string }> = {
  "erp-cyan": {
    normal: "text-erp-cyan bg-erp-cyan/10 hover:bg-erp-cyan/20 border-erp-cyan/30",
    ghost: "text-erp-cyan bg-transparent hover:bg-erp-cyan/10 border-border",
  },
  "erp-blue": {
    normal: "text-erp-blue bg-erp-blue/10 hover:bg-erp-blue/20 border-erp-blue/30",
    ghost: "text-erp-blue bg-transparent hover:bg-erp-blue/10 border-border",
  },
  "erp-yellow": {
    normal: "text-erp-yellow bg-erp-yellow/10 hover:bg-erp-yellow/20 border-erp-yellow/30",
    ghost: "text-erp-yellow bg-transparent hover:bg-erp-yellow/10 border-border",
  },
  "erp-red": {
    normal: "text-erp-red bg-erp-red/10 hover:bg-erp-red/20 border-erp-red/30",
    ghost: "text-erp-red bg-transparent hover:bg-erp-red/10 border-border",
  },
  "erp-green": {
    normal: "text-erp-green bg-erp-green/10 hover:bg-erp-green/20 border-erp-green/30",
    ghost: "text-erp-green bg-transparent hover:bg-erp-green/10 border-border",
  },
  "erp-purple": {
    normal: "text-erp-purple bg-erp-purple/10 hover:bg-erp-purple/20 border-erp-purple/30",
    ghost: "text-erp-purple bg-transparent hover:bg-erp-purple/10 border-border",
  },
  "erp-orange": {
    normal: "text-erp-orange bg-erp-orange/10 hover:bg-erp-orange/20 border-erp-orange/30",
    ghost: "text-erp-orange bg-transparent hover:bg-erp-orange/10 border-border",
  },
  "erp-finance": {
    normal: "text-erp-finance bg-erp-finance/10 hover:bg-erp-finance/20 border-erp-finance/30",
    ghost: "text-erp-finance bg-transparent hover:bg-erp-finance/10 border-border",
  },
  "muted-foreground": {
    normal: "text-muted-foreground bg-muted hover:bg-muted/80 border-border",
    ghost: "text-muted-foreground bg-transparent hover:bg-muted border-border",
  },
};

// CSS 變數名稱對照
const COLOR_VAR_MAP: Record<string, string> = {
  "erp-cyan": "--erp-cyan",
  "erp-blue": "--erp-blue",
  "erp-yellow": "--erp-yellow",
  "erp-red": "--erp-red",
  "erp-green": "--erp-green",
  "erp-purple": "--erp-purple",
  "erp-orange": "--erp-orange",
  "erp-finance": "--erp-finance",
  "muted-foreground": "--muted-foreground",
};

// Hex 色彩後備值
const COLOR_HEX_FALLBACK: Record<string, string> = {
  "erp-cyan": "#00BFA0",
  "erp-blue": "#4A84F5",
  "erp-yellow": "#D4A520",
  "erp-red": "#E84848",
  "erp-green": "#38D068",
  "erp-purple": "#B060F0",
  "erp-orange": "#E87038",
  "erp-finance": "#70A8FF",
  "muted-foreground": "#6B7B94",
};

// KPI Card 上方邊框色彩對照
export const ERP_KPI_BORDER_MAP: Record<string, string> = {
  "erp-cyan": "border-t-erp-cyan",
  "erp-blue": "border-t-erp-blue",
  "erp-yellow": "border-t-erp-yellow",
  "erp-red": "border-t-erp-red",
  "erp-green": "border-t-erp-green",
  "erp-purple": "border-t-erp-purple",
  "erp-orange": "border-t-erp-orange",
  "erp-finance": "border-t-erp-finance",
};

/**
 * 取得 CSS 變數的計算值
 */
function getCssColor(varName: string): string {
  if (typeof window === "undefined") return "";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  if (!value) return "";
  return `hsl(${value})`;
}

/**
 * 取得色彩的 Hex 值（用於圖表等）
 */
export function getColorHex(colorClass: string): string {
  const varName = COLOR_VAR_MAP[colorClass];
  if (varName) {
    const css = getCssColor(varName);
    if (css) return css;
  }
  return COLOR_HEX_FALLBACK[colorClass] || "#6B7B94";
}
