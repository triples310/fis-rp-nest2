import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ERP_BTN_STYLES } from "@/lib/constants/erp-colors";

interface ErpButtonProps {
  children: React.ReactNode;
  colorClass?: string;
  ghost?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function ErpButton({
  children,
  colorClass = "erp-cyan",
  ghost = false,
  onClick,
  className = "",
  type = "button",
}: ErpButtonProps) {
  const styles = ERP_BTN_STYLES[colorClass] || ERP_BTN_STYLES["erp-cyan"];
  return (
    <Button
      type={type}
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 cursor-pointer",
        ghost ? styles.ghost : styles.normal,
        className
      )}
    >
      {children}
    </Button>
  );
}
