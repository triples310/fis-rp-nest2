import React from "react";
import { Badge as ShadBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ERP_BADGE_STYLES } from "@/lib/constants/erp-colors";

interface ErpBadgeProps {
  colorClass: string;
  label: string;
  className?: string;
}

export function ErpBadge({ colorClass, label, className }: ErpBadgeProps) {
  const cls = ERP_BADGE_STYLES[colorClass] || ERP_BADGE_STYLES["muted-foreground"];
  return (
    <ShadBadge
      variant="outline"
      className={cn("text-[10px] font-bold tracking-wide rounded px-2 py-0.5", cls, className)}
    >
      {label}
    </ShadBadge>
  );
}
