import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErpModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function ErpModal({
  title,
  onClose,
  children,
  width = 560,
}: ErpModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-erp-surface border-border max-h-[85vh] overflow-y-auto"
        style={{ maxWidth: width }}
      >
        <DialogHeader>
          <DialogTitle className="text-[13px] font-bold">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
