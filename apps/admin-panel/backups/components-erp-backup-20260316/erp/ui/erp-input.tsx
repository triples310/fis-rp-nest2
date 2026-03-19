import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ErpInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}

export function ErpInput({
  placeholder,
  value,
  onChange,
  className = "",
  type = "text",
}: ErpInputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={cn("bg-erp-surface border-border h-8 text-xs font-mono", className)}
    />
  );
}
