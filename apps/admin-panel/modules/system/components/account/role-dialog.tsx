"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { USERS } from "@/lib/data/mock-data";

const PERM_MODULES = [
  { group: "商品管理", items: ["商品", "商品品牌", "商品分類"] },
  { group: "訂單管理", items: ["訂單"] },
  { group: "採購管理", items: ["採購單", "進貨驗收", "供應商"] },
  { group: "倉儲作業", items: ["入庫", "出庫", "調撥"] },
  { group: "生產管理", items: ["投料", "加工分色", "成品報工"] },
  { group: "庫存管理", items: ["批號查詢", "效期管理", "庫存調整"] },
  { group: "財務管理", items: ["應付帳款", "損益分析"] },
];

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    name: string;
    accounts: string[];
    note: string;
  };
  onFormChange: (form: any) => void;
  perms: Record<string, { edit: boolean; view: boolean }>;
  onTogglePerm: (item: string, type: "edit" | "view") => void;
  onToggleGroupHeader: (group: string, type: "edit" | "view") => void;
}

export function RoleDialog({ 
  open, 
  onOpenChange, 
  form, 
  onFormChange, 
  perms,
  onTogglePerm,
  onToggleGroupHeader
}: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            新增角色
          </DialogTitle>
          <DialogDescription>設定角色資訊與功能權限</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto space-y-5 py-1 pr-1">
          {/* Basic info section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">明細</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">名稱 <span className="text-destructive">*</span></Label>
                <Input value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">對應帳號</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇帳號" />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map((u) => (
                      <SelectItem key={u.acc} value={u.acc}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">備註</Label>
                <Textarea value={form.note} onChange={(e) => onFormChange({ ...form, note: e.target.value })} className="min-h-[72px] resize-none" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Permissions matrix */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">功能權限</h3>
            <Card className="border-border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[200px] font-semibold text-xs tracking-wider">功能列表</TableHead>
                    <TableHead className="text-center w-[100px] font-semibold text-xs tracking-wider">
                      <div className="flex items-center justify-center gap-1.5">修改 <Checkbox className="h-3.5 w-3.5" /></div>
                    </TableHead>
                    <TableHead className="text-center w-[100px] font-semibold text-xs tracking-wider">
                      <div className="flex items-center justify-center gap-1.5">檢視 <Checkbox className="h-3.5 w-3.5" /></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERM_MODULES.map((mod) => (
                    <>
                      <TableRow key={mod.group} className="bg-primary/8 hover:bg-primary/12">
                        <TableCell className="font-semibold text-sm">
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              className="h-4 w-4"
                              onCheckedChange={() => {
                                onToggleGroupHeader(mod.group, "edit");
                                onToggleGroupHeader(mod.group, "view");
                              }}
                            />
                            <span>{mod.group}</span>
                          </div>
                        </TableCell>
                        <TableCell />
                        <TableCell />
                      </TableRow>
                      {mod.items.map((item) => (
                        <TableRow key={item} className="hover:bg-muted/30">
                          <TableCell className="pl-11">
                            <div className="flex items-center gap-2.5">
                              <Checkbox className="h-4 w-4" />
                              <span className="text-sm">{item}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                className="h-4 w-4"
                                checked={perms[item]?.edit || false}
                                onCheckedChange={() => onTogglePerm(item, "edit")}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                className="h-4 w-4"
                                checked={perms[item]?.view || false}
                                onCheckedChange={() => onTogglePerm(item, "view")}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Card>
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
