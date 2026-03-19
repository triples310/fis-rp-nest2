import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ERP_KPI_BORDER_MAP, ERP_COLOR_TEXT } from "@/lib/constants/erp-colors";

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
