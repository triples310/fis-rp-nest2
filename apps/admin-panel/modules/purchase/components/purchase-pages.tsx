"use client";

import { useState, useMemo } from "react";
import { POS, VENDORS, PRODS } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableHeader as ShadTableHeader, TableRow } from "@/components/ui/table";
import { ErpCard } from "@/components/erp-card";
import { Row, STitle, Divider } from "@/components/layout";
import { ErpInput, ErpSelect } from "@/components/forms";
import { ErpTableHeader, ErpTableCell } from "@/components/data-display";
import { ErpModal } from "@/components/feedback/erp-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, History, Lightbulb, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// ── PO Line Item ──
interface PoLineItem {
  sku: string;
  name: string;
  stock: number;
  suggest: number;
  unit: string;
  qty: number;
  price: number;
}

// ── Create PO Modal ──
function CreatePoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [vendor, setVendor] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [taxId, setTaxId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [taxRate, setTaxRate] = useState("5");
  const [eta, setEta] = useState("");
  const [remark, setRemark] = useState("");
  const [items, setItems] = useState<PoLineItem[]>([
    { sku: "", name: "", stock: 0, suggest: 0, unit: "kg", qty: 0, price: 0 },
  ]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  const poNumber = `PO-2026-${String(POS.length + 1).padStart(4, "0")}`;

  function addItem() {
    setItems(p => [...p, { sku: "", name: "", stock: 0, suggest: 0, unit: "kg", qty: 0, price: 0 }]);
  }

  function removeItem(idx: number) {
    setItems(p => p.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: string, value: string | number) {
    setItems(p => p.map((it, i) => {
      if (i !== idx) return it;
      if (field === "name") {
        const prod = PRODS.find(pr => pr.name === value);
        if (prod) {
          const safeStock = Math.round(prod.stock * 0.3);
          return {
            ...it,
            name: prod.name,
            sku: prod.sku,
            stock: prod.stock,
            suggest: Math.max(0, safeStock - prod.stock + 50),
            unit: prod.type === "包材" ? "個" : "kg",
            price: prod.cost,
          };
        }
        return { ...it, name: value as string };
      }
      return { ...it, [field]: value };
    }));
  }

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.qty * it.price, 0), [items]);
  const taxAmount = useMemo(() => Math.round(subtotal * (parseFloat(taxRate) / 100)), [subtotal, taxRate]);
  const total = subtotal + taxAmount;

  function handleSubmit() {
    onClose();
  }

  function handleDraft() {
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={v => !v && onClose()}>
        <DialogContent className="bg-card border-border max-w-[950px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="bg-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-base font-bold text-primary-foreground">建立採購單</DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">基本資訊 & 財務設定</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">採購單號</Label>
                    <Input value={poNumber} readOnly className="h-9 text-xs font-mono bg-muted border-border" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">供應商名稱 <span className="text-destructive">*</span></Label>
                    <Select value={vendor} onValueChange={v => { setVendor(v); const vd = VENDORS.find(x => x.name === v); setVendorCode(vd ? `VND-${String(VENDORS.indexOf(vd) + 1).padStart(3, "0")}` : ""); }}>
                      <SelectTrigger className="h-9 text-xs bg-background border-border">
                        <SelectValue placeholder="選擇供應商…" />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDORS.map(v => (
                          <SelectItem key={v.name} value={v.name} className="text-xs">{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">供應商編號</Label>
                    <Input value={vendorCode} readOnly className="h-9 text-xs font-mono bg-muted border-border" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">統一編號</Label>
                    <Input value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="輸入統一編號" className="h-9 text-xs bg-background border-border" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">發票號碼</Label>
                    <Input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="輸入發票號碼" className="h-9 text-xs bg-background border-border" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">稅率設定</Label>
                    <Select value={taxRate} onValueChange={setTaxRate}>
                      <SelectTrigger className="h-9 text-xs bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5" className="text-xs">應稅 (5%)</SelectItem>
                        <SelectItem value="0" className="text-xs">零稅率 (0%)</SelectItem>
                        <SelectItem value="-1" className="text-xs">免稅</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">預計到貨日</Label>
                    <Input type="date" value={eta} onChange={e => setEta(e.target.value)} className="h-9 text-xs bg-background border-border" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground">採購品項明細</h3>
                  <Button variant="outline" size="sm" onClick={addItem} className="h-8 text-xs gap-1 border-border">
                    <Plus className="h-3.5 w-3.5" />
                    新增品項
                  </Button>
                </div>

                {/* Table header */}
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-[80px_1fr_60px_70px_50px_70px_80px_80px_36px] gap-2 px-2 py-2 bg-muted/50 rounded-t-lg text-[10px] text-muted-foreground font-bold tracking-wider">
                      <span>商品編號</span><span>品項名稱</span><span>庫存</span><span>建議採購</span><span>單位</span><span>數量</span><span>單價(NT$)</span><span>小計</span><span />
                    </div>

                    <div className="space-y-2 mt-2">
                      {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[80px_1fr_60px_70px_50px_70px_80px_80px_36px] gap-2 px-2 items-center">
                          <Input value={item.sku} readOnly className="h-8 text-[10px] font-mono bg-muted border-border px-2" />
                          <Select value={item.name} onValueChange={v => updateItem(idx, "name", v)}>
                            <SelectTrigger className="h-8 text-[10px] bg-background border-border">
                              <SelectValue placeholder="搜尋品項…" />
                            </SelectTrigger>
                            <SelectContent>
                              {PRODS.map(p => (
                                <SelectItem key={p.sku} value={p.name} className="text-xs">{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-[10px] text-muted-foreground text-center">{item.stock || "—"}</span>
                          <span className={cn("text-[10px] text-center font-bold", item.suggest > 0 ? "text-erp-red" : "text-muted-foreground")}>
                            {item.suggest || "—"}
                          </span>
                          <span className="text-[10px] text-muted-foreground text-center">{item.unit}</span>
                          <Input
                            type="number"
                            value={item.qty || ""}
                            onChange={e => updateItem(idx, "qty", parseInt(e.target.value) || 0)}
                            className="h-8 text-[10px] font-mono bg-background border-border px-2 text-center"
                          />
                          <Input
                            type="number"
                            value={item.price || ""}
                            onChange={e => updateItem(idx, "price", parseInt(e.target.value) || 0)}
                            className="h-8 text-[10px] font-mono bg-background border-border px-2 text-center"
                          />
                          <span className="text-[10px] font-bold text-foreground text-right">
                            {(item.qty * item.price) > 0 ? `$${(item.qty * item.price).toLocaleString()}` : "—"}
                          </span>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Remark & totals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1.5 block">採購備註</Label>
                      <Textarea
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                        placeholder="輸入備註說明…"
                        className="text-xs bg-background border-border min-h-[60px]"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1.5 block">附件上傳 (PDF/JPG)</Label>
                      <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">選擇檔案</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} className="h-8 text-xs gap-1 border-border">
                        <History className="h-3.5 w-3.5" />
                        歷史價格
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowFormula(true)} className="h-8 text-xs gap-1 border-border">
                        <Lightbulb className="h-3.5 w-3.5" />
                        採購建議
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>銷售額 (未稅)</span>
                        <span>NT$ {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>稅額 ({taxRate === "-1" ? "免稅" : `${taxRate}%`})</span>
                        <span>NT$ {taxRate === "-1" ? 0 : taxAmount.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span />
                        <span>NT$ {(taxRate === "-1" ? subtotal : total).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" onClick={handleDraft} className="flex-1 h-10 text-xs font-bold border-border">
                        儲存草稿
                      </Button>
                      <Button onClick={handleSubmit} className="flex-1 h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                        提交採購單
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Price Modal */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">📈 歷史價格記錄 (最近 5 筆)</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <ShadTableHeader>
                <TableRow><ErpTableHeader>日期</ErpTableHeader><ErpTableHeader>PO</ErpTableHeader><ErpTableHeader>品項</ErpTableHeader><ErpTableHeader>單價</ErpTableHeader><ErpTableHeader>數量</ErpTableHeader></TableRow>
              </ShadTableHeader>
              <TableBody>
                {[
                  { date: "2026-02-28", po: "PO-0101", item: "鱘魚原料", price: 180, qty: 300 },
                  { date: "2026-02-25", po: "PO-0102", item: "魚子原料", price: 560, qty: 100 },
                  { date: "2026-02-20", po: "PO-0104", item: "玻璃罐", price: 12, qty: 1000 },
                  { date: "2026-02-18", po: "PO-0107", item: "鱘魚原料", price: 175, qty: 400 },
                  { date: "2026-02-10", po: "PO-0095", item: "魚子原料", price: 550, qty: 200 },
                ].map((r, i) => (
                  <TableRow key={i}>
                    <ErpTableCell colorClass="muted-foreground">{r.date}</ErpTableCell>
                    <ErpTableCell mono colorClass="erp-yellow" className="text-[10px]">{r.po}</ErpTableCell>
                    <ErpTableCell>{r.item}</ErpTableCell>
                    <ErpTableCell bold>NT${r.price}</ErpTableCell>
                    <ErpTableCell colorClass="muted-foreground">{r.qty}</ErpTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Formula Modal */}
      <Dialog open={showFormula} onOpenChange={setShowFormula}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">💡 建議採購計算公式</DialogTitle>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <p className="text-xs text-foreground font-bold">建議採購 = 安全庫存 - 目前庫存 + 未到貨數</p>
            <Separator />
            <p className="text-[10px] text-muted-foreground">※ 安全庫存量係依據過去三個月平均銷售數據自動計算得出。</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PoList() {
  const [detail, setDetail] = useState<typeof POS[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">採購單列表</span>
        <Button variant="erp-yellow" onClick={() => setShowCreate(true)}>＋ 建立採購單</Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-3.5">
        <ErpInput placeholder="搜尋採購單號/供應商…" className="w-full sm:w-[220px]" />
        <ErpSelect className="w-[120px]"><option>全部狀態</option><option>草稿</option><option>待驗收</option><option>已入庫</option></ErpSelect>
        <ErpSelect className="w-[120px]"><option>全部供應商</option>{VENDORS.map((v) => <option key={v.name}>{v.name}</option>)}</ErpSelect>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <ShadTableHeader><TableRow><ErpTableHeader>採購單號</ErpTableHeader><ErpTableHeader>供應商</ErpTableHeader><ErpTableHeader>狀態</ErpTableHeader><ErpTableHeader>品項</ErpTableHeader><ErpTableHeader>金額</ErpTableHeader><ErpTableHeader>建立日期</ErpTableHeader><ErpTableHeader>預計到貨</ErpTableHeader><ErpTableHeader>操作</ErpTableHeader></TableRow></ShadTableHeader>
            <TableBody>
              {POS.map((po) => (
                <TableRow key={po.id} className="hover:bg-erp-yellow/[0.04] transition-colors">
                  <ErpTableCell mono colorClass="erp-yellow">{po.id}</ErpTableCell>
                  <ErpTableCell>{po.vendor}</ErpTableCell>
                  <ErpTableCell><Badge variant={po.status === "待驗收" ? "erp-orange" : po.status === "已入庫" ? "erp-green" : "muted-foreground" as any}>{po.status}</Badge></ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{po.items} 項</ErpTableCell>
                  <ErpTableCell bold>NT${po.amount.toLocaleString()}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{po.created}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{po.eta}</ErpTableCell>
                  <ErpTableCell>
                    <Row className="gap-1.5">
                      <Button variant="muted-foreground-ghost" onClick={() => setDetail(po)}>查看</Button>
                      {po.status === "待驗收" && <Button variant="erp-orange">執行驗收</Button>}
                      {po.status === "草稿" && <Button variant="erp-yellow">提交</Button>}
                    </Row>
                  </ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
      {detail && (
        <ErpModal title={`採購單 · ${detail.id}`} onClose={() => setDetail(null)}>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            {[["供應商", detail.vendor], ["狀態", detail.status], ["品項數", `${detail.items} 項`], ["金額", `NT$${detail.amount.toLocaleString()}`], ["建立日期", detail.created], ["預計到貨", detail.eta]].map(([l, v]) => (
              <div key={l}><div className="text-[10px] text-muted-foreground mb-1">{l}</div><div className="text-[13px] text-foreground">{v}</div></div>
            ))}
          </div>
          <Divider />
          <div className="text-[10px] text-muted-foreground mb-2">採購明細</div>
          <div className="overflow-x-auto">
            <Table>
              <ShadTableHeader><TableRow><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>數量</ErpTableHeader><ErpTableHeader>單價</ErpTableHeader><ErpTableHeader>小計</ErpTableHeader></TableRow></ShadTableHeader>
              <TableBody>
                {[{ name: "鱘魚原料", qty: 300, price: 180 }, { name: "魚子原料", qty: 100, price: 560 }, { name: "包裝玻璃罐", qty: 1000, price: 12 }].slice(0, detail.items).map((r, i) => (
                  <TableRow key={i}><ErpTableCell>{r.name}</ErpTableCell><ErpTableCell>{r.qty}</ErpTableCell><ErpTableCell>NT${r.price}</ErpTableCell><ErpTableCell bold>NT${(r.qty * r.price).toLocaleString()}</ErpTableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ErpModal>
      )}
      <CreatePoModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}

export function PoQC() {
  const [decisions, setDecisions] = useState<Record<number, string>>({});
  const items = [
    { sku: "魚子醬原料", batch: "原廠-2026030A", qty: 80, unit: "kg" },
    { sku: "鱘魚片原料", batch: "原廠-2026030B", qty: 200, unit: "kg" },
    { sku: "包裝材料", batch: "原廠-2026030C", qty: 500, unit: "個" },
    { sku: "煙燻調料", batch: "原廠-2026030D", qty: 50, unit: "kg" },
  ];
  return (
    <div>
      <div className="text-[13px] font-bold text-foreground mb-4">進貨驗收 (QC)</div>
      <div className="rounded-lg px-4 py-3 mb-4 bg-erp-orange/10 border border-erp-orange/30">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-erp-orange">待驗收：PO-2026-0101</span>
          <span className="text-[11px] text-muted-foreground">· 供應商：龍騰水產 · 到貨 {items.length} 批 · 預計到貨：2026-03-04</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          {items.map((item, i) => {
            const d = decisions[i];
            return (
              <ErpCard key={i} className="mb-3">
                <Row className="justify-between mb-2.5 flex-wrap gap-2">
                  <div>
                    <div className="text-[13px] text-foreground font-bold">{item.sku}</div>
                    <div className="text-[10px] text-muted-foreground">原廠批號：{item.batch} · 採購量 {item.qty}{item.unit}</div>
                  </div>
                  {d && <Badge variant={d === "pass" ? "erp-green" : "erp-red" as any}>{d === "pass" ? "✓ 允收" : "✗ 退貨"}</Badge>}
                </Row>
                {!d && (
                  <div>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <ErpInput placeholder={`實收數量（${item.unit}）`} type="number" className="flex-1" />
                      <ErpInput placeholder="備註（選填）" className="flex-[2]" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="erp-green" onClick={() => setDecisions((p) => ({ ...p, [i]: "pass" }))} className="flex-1">✓ 允收入庫</Button>
                      <Button variant="erp-red" onClick={() => setDecisions((p) => ({ ...p, [i]: "fail" }))} className="flex-1">✗ 退貨</Button>
                    </div>
                  </div>
                )}
                {d === "fail" && <div className="text-[11px] text-erp-red mt-1.5">→ 自動建立退貨單 RMA，不進入可用庫存</div>}
                {d === "pass" && <div className="text-[11px] text-erp-green mt-1.5">→ 系統將自動生成批號並執行入庫流程</div>}
              </ErpCard>
            );
          })}
        </div>
        <ErpCard>
          <STitle>歷史驗收記錄</STitle>
          <div className="overflow-x-auto">
            <Table>
              <ShadTableHeader><TableRow><ErpTableHeader>日期</ErpTableHeader><ErpTableHeader>PO</ErpTableHeader><ErpTableHeader>商品</ErpTableHeader><ErpTableHeader>結果</ErpTableHeader><ErpTableHeader>QC</ErpTableHeader></TableRow></ShadTableHeader>
              <TableBody>
                {[
                  { date: "03/01", po: "0102", sku: "鱘魚原料", ok: true, qc: "張主任" },
                  { date: "03/01", po: "0102", sku: "魚子原料", ok: true, qc: "張主任" },
                  { date: "02/24", po: "0104", sku: "玻璃罐", ok: true, qc: "黃品管" },
                  { date: "02/22", po: "0107", sku: "鱘魚原料", ok: true, qc: "張主任" },
                  { date: "02/20", po: "0098", sku: "包裝材料", ok: false, qc: "黃品管" },
                  { date: "02/18", po: "0107", sku: "煙燻調料", ok: true, qc: "張主任" },
                ].map((r, i) => (
                  <TableRow key={i}>
                    <ErpTableCell colorClass="muted-foreground">{r.date}</ErpTableCell>
                    <ErpTableCell mono colorClass="muted-foreground" className="text-[10px]">{r.po}</ErpTableCell>
                    <ErpTableCell>{r.sku}</ErpTableCell>
                    <ErpTableCell><Badge variant={r.ok ? "erp-green" : "erp-red" as any}>{r.ok ? "允收" : "退貨"}</Badge></ErpTableCell>
                    <ErpTableCell colorClass="muted-foreground">{r.qc}</ErpTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ErpCard>
      </div>
    </div>
  );
}

export function PoSuggest() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">系統採購建議</span>
        <Button variant="erp-yellow">一鍵建立所有緊急 PO</Button>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <ShadTableHeader><TableRow><ErpTableHeader>原料</ErpTableHeader><ErpTableHeader>現有庫存</ErpTableHeader><ErpTableHeader>安全庫存</ErpTableHeader><ErpTableHeader>在途數量</ErpTableHeader><ErpTableHeader>預計需求(30天)</ErpTableHeader><ErpTableHeader>建議採購量</ErpTableHeader><ErpTableHeader>優先級</ErpTableHeader><ErpTableHeader>操作</ErpTableHeader></TableRow></ShadTableHeader>
            <TableBody>
              {[
                { sku: "魚子原料", cur: 150, safe: 200, transit: 0, need: 280, suggest: 130, urgent: true },
                { sku: "鱘魚原料", cur: 400, safe: 300, transit: 100, need: 380, suggest: 0, urgent: false },
                { sku: "包裝玻璃罐", cur: 800, safe: 500, transit: 0, need: 600, suggest: 0, urgent: false },
                { sku: "精裝禮盒紙", cur: 120, safe: 200, transit: 50, need: 180, suggest: 30, urgent: true },
                { sku: "煙燻調料", cur: 80, safe: 100, transit: 0, need: 120, suggest: 40, urgent: true },
                { sku: "鋁箔袋", cur: 500, safe: 300, transit: 0, need: 400, suggest: 0, urgent: false },
                { sku: "魚子醬原料", cur: 90, safe: 150, transit: 0, need: 200, suggest: 110, urgent: true },
              ].map((r, i) => (
                <TableRow key={i} className="hover:bg-erp-yellow/[0.04] transition-colors">
                  <ErpTableCell>{r.sku}</ErpTableCell>
                  <ErpTableCell bold colorClass={r.cur < r.safe ? "erp-red" : "erp-green"}>{r.cur}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{r.safe}</ErpTableCell>
                  <ErpTableCell colorClass="erp-blue">{r.transit || "—"}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{r.need}</ErpTableCell>
                  <ErpTableCell bold colorClass={r.suggest > 0 ? "erp-yellow" : "muted-foreground"}>{r.suggest > 0 ? `${r.suggest} 單位` : "充足"}</ErpTableCell>
                  <ErpTableCell>{r.urgent ? <Badge variant="erp-red">🔴 緊急</Badge> : <Badge variant="erp-green">正常</Badge>}</ErpTableCell>
                  <ErpTableCell>{r.suggest > 0 && <Button variant="erp-yellow" className="text-[10px] py-1 px-2.5">建立 PO</Button>}</ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
    </div>
  );
}

export function PoVendor() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <span className="text-[13px] font-bold text-foreground">供應商管理</span>
        <Button variant="erp-yellow">＋ 新增供應商</Button>
      </div>
      <ErpCard>
        <div className="overflow-x-auto">
          <Table>
            <ShadTableHeader><TableRow><ErpTableHeader>供應商</ErpTableHeader><ErpTableHeader>供應品類</ErpTableHeader><ErpTableHeader>付款天期</ErpTableHeader><ErpTableHeader>聯絡人</ErpTableHeader><ErpTableHeader>QC合格率</ErpTableHeader><ErpTableHeader>訂單數</ErpTableHeader><ErpTableHeader>評分</ErpTableHeader><ErpTableHeader>操作</ErpTableHeader></TableRow></ShadTableHeader>
            <TableBody>
              {VENDORS.map((v, i) => (
                <TableRow key={i} className="hover:bg-erp-yellow/[0.04] transition-colors">
                  <ErpTableCell bold colorClass="erp-yellow">{v.name}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{v.cat}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground">{v.terms}</ErpTableCell>
                  <ErpTableCell colorClass="muted-foreground" className="text-[11px]">{v.contact}</ErpTableCell>
                  <ErpTableCell colorClass={v.qcRate >= 97 ? "erp-green" : "erp-yellow"}>{v.qcRate}%</ErpTableCell>
                  <ErpTableCell>{v.orders}</ErpTableCell>
                  <ErpTableCell>
                    <span className="text-erp-yellow">{"★".repeat(Math.max(0, Math.round(v.score)))}</span>
                    <span className="text-erp-dim">{"★".repeat(Math.max(0, 5 - Math.round(v.score)))}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{v.score}</span>
                  </ErpTableCell>
                  <ErpTableCell><Row className="gap-1.5"><Button variant="muted-foreground-ghost">編輯</Button><Button variant="erp-yellow-ghost">下單</Button></Row></ErpTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ErpCard>
    </div>
  );
}
