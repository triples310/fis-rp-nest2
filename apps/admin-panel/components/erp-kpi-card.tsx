import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ERP 顏色映射 (內聯定義)
const ERP_KPI_BORDER_MAP: Record<string, string> = {
  "erp-cyan": "border-t-erp-cyan",
  "erp-blue": "border-t-erp-blue",
  "erp-yellow": "border-t-erp-yellow",
  "erp-red": "border-t-erp-red",
  "erp-green": "border-t-erp-green",
  "erp-purple": "border-t-erp-purple",
  "erp-orange": "border-t-erp-orange",
  "erp-finance": "border-t-erp-finance",
};

const ERP_COLOR_TEXT: Record<string, string> = {
  "erp-cyan": "text-erp-cyan",
  "erp-blue": "text-erp-blue",
  "erp-yellow": "text-erp-yellow",
  "erp-red": "text-erp-red",
  "erp-green": "text-erp-green",
  "erp-purple": "text-erp-purple",
  "erp-orange": "text-erp-orange",
  "erp-finance": "text-erp-finance",
};

interface ErpKpiCardProps {
  label: string;
  value: string;
  sub?: string;
  colorClass?: string;
  icon?: string;
}

export function ErpKpiCard({
  label,
  value,
  sub,
  colorClass = "erp-cyan",
  icon,
}: ErpKpiCardProps) {
  const borderCls = ERP_KPI_BORDER_MAP[colorClass] || "";
  const textCls = ERP_COLOR_TEXT[colorClass] || "text-erp-cyan";
  
  return (
    <Card
      className={cn(
        "border-border bg-erp-card border-t-2 flex-1 min-w-[140px]",
        borderCls
      )}
    >
      <CardContent className="p-4">
        <div className="text-xl mb-1">{icon}</div>
        <div className="text-[10px] text-muted-foreground tracking-wide mb-1">
          {label}
        </div>
        <div className={cn("text-xl md:text-[22px] font-bold tabular-nums", textCls)}>
          {value}
        </div>
        {sub && <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}
