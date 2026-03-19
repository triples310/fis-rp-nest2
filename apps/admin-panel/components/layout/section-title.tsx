import React from "react";

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
