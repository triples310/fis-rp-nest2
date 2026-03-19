import React from "react";
import { cn } from "@/lib/utils";

interface RowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Row({ children, className = "", style }: RowProps) {
  return (
    <div className={cn("flex items-center", className)} style={style}>
      {children}
    </div>
  );
}
