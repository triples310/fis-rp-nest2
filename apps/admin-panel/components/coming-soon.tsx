import React from "react";
import { ErpCard } from "@/components/erp-card";

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <ErpCard>
      <div className="text-center py-16 text-muted-foreground text-sm">
        {title} — 功能開發中
      </div>
    </ErpCard>
  );
}
