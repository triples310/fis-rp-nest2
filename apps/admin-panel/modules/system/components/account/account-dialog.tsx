"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog } from "lucide-react";

const ROLE_OPTIONS = ["系統管理者", "一般使用者"];

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    name: string;
    account: string;
    password: string;
    email: string;
    role: string;
    note: string;
  };
  onFormChange: (form: any) => void;
}

export function AccountDialog({ open, onOpenChange, form, onFormChange }: AccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            新增帳號
          </DialogTitle>
          <DialogDescription>填寫帳號基本資料</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="space-y-5 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">名稱 <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">登入帳號 <span className="text-destructive">*</span></Label>
              <Input placeholder="帳號" value={form.account} onChange={(e) => onFormChange({ ...form, account: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">登入密碼 <span className="text-destructive">*</span></Label>
              <Input type="password" value={form.password} onChange={(e) => onFormChange({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">E-mail</Label>
            <Input type="email" value={form.email} onChange={(e) => onFormChange({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">角色</Label>
            <Select value={form.role} onValueChange={(v) => onFormChange({ ...form, role: v })}>
              <SelectTrigger>
                <SelectValue placeholder="請選擇角色" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">備註</Label>
            <Textarea value={form.note} onChange={(e) => onFormChange({ ...form, note: e.target.value })} className="min-h-[80px] resize-none" />
          </div>
        </div>
        <Separator />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onOpenChange(false)}>儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
