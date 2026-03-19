import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErpCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ErpCard({ children, className = "" }: ErpCardProps) {
  return (
    <Card className={cn("border-border bg-erp-card", className)}>
      <CardContent className="p-4 md:p-5">{children}</CardContent>
    </Card>
  );
}
