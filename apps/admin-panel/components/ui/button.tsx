import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // ERP Button Variants - 完全保留原 ErpButton 樣式
        "erp-cyan": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-cyan bg-erp-cyan/10 hover:bg-erp-cyan/20 border border-erp-cyan/30",
        "erp-cyan-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-cyan bg-transparent hover:bg-erp-cyan/10 border border-border",
        "erp-blue": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-blue bg-erp-blue/10 hover:bg-erp-blue/20 border border-erp-blue/30",
        "erp-blue-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-blue bg-transparent hover:bg-erp-blue/10 border border-border",
        "erp-yellow": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-yellow bg-erp-yellow/10 hover:bg-erp-yellow/20 border border-erp-yellow/30",
        "erp-yellow-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-yellow bg-transparent hover:bg-erp-yellow/10 border border-border",
        "erp-red": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-red bg-erp-red/10 hover:bg-erp-red/20 border border-erp-red/30",
        "erp-red-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-red bg-transparent hover:bg-erp-red/10 border border-border",
        "erp-green": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-green bg-erp-green/10 hover:bg-erp-green/20 border border-erp-green/30",
        "erp-green-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-green bg-transparent hover:bg-erp-green/10 border border-border",
        "erp-purple": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-purple bg-erp-purple/10 hover:bg-erp-purple/20 border border-erp-purple/30",
        "erp-purple-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-purple bg-transparent hover:bg-erp-purple/10 border border-border",
        "erp-orange": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-orange bg-erp-orange/10 hover:bg-erp-orange/20 border border-erp-orange/30",
        "erp-orange-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-orange bg-transparent hover:bg-erp-orange/10 border border-border",
        "erp-finance": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-finance bg-erp-finance/10 hover:bg-erp-finance/20 border border-erp-finance/30",
        "erp-finance-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-erp-finance bg-transparent hover:bg-erp-finance/10 border border-border",
        "muted-foreground": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-muted-foreground bg-muted hover:bg-muted/80 border border-border",
        "muted-foreground-ghost": "text-[11px] font-bold tracking-wide h-auto py-1.5 px-3.5 text-muted-foreground bg-transparent hover:bg-muted border border-border",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
