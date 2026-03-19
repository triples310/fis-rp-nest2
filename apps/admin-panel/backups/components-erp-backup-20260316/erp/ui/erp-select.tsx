import React from "react";
import { cn } from "@/lib/utils";

interface ErpSelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export function ErpSelect({
  value,
  onChange,
  children,
  className = "",
}: ErpSelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "bg-erp-surface border border-border rounded-md text-foreground text-xs py-1.5 px-3 outline-none cursor-pointer font-mono h-8",
        className
      )}
    >
      {children}
    </select>
  );
}
