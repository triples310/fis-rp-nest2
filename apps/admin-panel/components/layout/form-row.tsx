import React from "react";

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
