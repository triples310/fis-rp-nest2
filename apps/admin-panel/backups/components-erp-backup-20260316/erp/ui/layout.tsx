import React from "react";
import { Separator } from "@/components/ui/separator";
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

interface STitleProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function STitle({ children, action }: STitleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[13px] font-bold text-foreground tracking-wide">
        {children}
      </span>
      {action}
    </div>
  );
}

export function Divider() {
  return <Separator className="my-3.5" />;
}

interface FormRowProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormRow({ label, children, required }: FormRowProps) {
  return (
    <div className="mb-3">
      <div className="text-[10px] text-muted-foreground mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-erp-red"> *</span>}
      </div>
      {children}
    </div>
  );
}
