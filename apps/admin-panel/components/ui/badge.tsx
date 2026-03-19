import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        
        // ERP Variants - 完全保留原 ErpBadge 樣式
        "erp-cyan": "bg-erp-cyan/15 text-erp-cyan border-erp-cyan/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-blue": "bg-erp-blue/15 text-erp-blue border-erp-blue/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-yellow": "bg-erp-yellow/15 text-erp-yellow border-erp-yellow/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-red": "bg-erp-red/15 text-erp-red border-erp-red/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-green": "bg-erp-green/15 text-erp-green border-erp-green/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-purple": "bg-erp-purple/15 text-erp-purple border-erp-purple/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-orange": "bg-erp-orange/15 text-erp-orange border-erp-orange/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "erp-finance": "bg-erp-finance/15 text-erp-finance border-erp-finance/30 text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
        "muted-foreground": "bg-muted text-muted-foreground border-border text-[10px] font-bold tracking-wide rounded px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
