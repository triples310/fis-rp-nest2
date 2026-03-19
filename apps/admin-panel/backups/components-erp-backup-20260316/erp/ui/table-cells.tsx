import React from "react";
import { TableHead, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ERP_COLOR_TEXT } from "@/lib/constants/erp-colors";

interface ErpTableHeaderProps {
  children: React.ReactNode;
}

export function ErpTableHeader({ children }: ErpTableHeaderProps) {
  return (
    <TableHead className="px-3 py-2 text-muted-foreground text-[10px] font-bold tracking-widest whitespace-nowrap">
      {children}
    </TableHead>
  );
}

interface ErpTableCellProps {
  children: React.ReactNode;
  colorClass?: string;
  bold?: boolean;
  mono?: boolean;
  className?: string;
}

export function ErpTableCell({
  children,
  colorClass,
  bold,
  mono,
  className = "",
}: ErpTableCellProps) {
  const colorCls = colorClass ? (ERP_COLOR_TEXT[colorClass] || "") : "";
  return (
    <TableCell
      className={cn(
        "px-3 py-2 text-xs whitespace-nowrap",
        bold && "font-bold",
        mono && "font-mono",
        colorCls,
        className
      )}
    >
      {children}
    </TableCell>
  );
}
