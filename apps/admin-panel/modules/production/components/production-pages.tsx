"use client";

import { useState, useMemo } from "react";
import { WOS, BATCHES } from "@/lib/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHeader as ShadTableHeader, TableRow } from "@/components/ui/table";
import { ErpCard } from "@/components/erp-card";
import { Row, STitle, FormRow } from "@/components/layout";
import { ErpSelect, ErpInput } from "@/components/forms";
import { ErpTableHeader, ErpTableCell } from "@/components/data-display";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, ScanLine, QrCode, Printer, CheckCircle2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";



// ── Semi-finished product options for output ──
const SEMI_PRODUCTS = [
  { id: "S001", name: "鱘龍魚萃 (100ml)", unit: "包" },
  { id: "S002", name: "鱘龍魚精 (60ml)", unit: "瓶" },
  { id: "S003", name: "鱘龍魚膠原蛋白粉 (50g)", unit: "包" },
  { id: "S004", name: "鱘龍骨湯底 (500ml)", unit: "包" },
  { id: "S005", name: "鱘龍魚油膠囊 (30入)", unit: "盒" },
];

interface OutputItem {
  productId: string;
  productName: string;
  qty: number;
  unit: string;
}

interface ScannedBatch {
  batch: string;
  sku: string;
  weight: number;
  time: string;
}

export function WoMaterial() {
  const [station] = useState("車間 A-01");
  const [mixBatch] = useState("MIX-260309-A01");
  const [scannedBatches, setScannedBatches] = useState<ScannedBatch[]>([]);
  const [scanInput, setScanInput] = useState("");
  const [scanAlert, setScanAlert] = useState<{ type: "ok" | "error" | "warn"; msg: string } | null>(null);

  // Step 2: output items
  const [outputItems, setOutputItems] = useState<OutputItem[]>([
    { productId: "S001", productName: "鱘龍魚萃 (100ml)", qty: 50, unit: "包" },
  ]);

  // Step 3: remaining material
  const [remainWeight, setRemainWeight] = useState("2.50");

  // Label dates
  const today = "2026-03-09";
  const [completionDate, setCompletionDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState("2027-03-09");

  // Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  const totalInputWeight = useMemo(() => 
    scannedBatches.reduce((s, b) => s + b.weight, 0), 
    [scannedBatches]
  );

  function handleScan() {
    const v = scanInput.trim();
    if (!v) return;
    const b = BATCHES.find((x) => x.batch === v);
    if (!b) {
      setScanAlert({ type: "error", msg: `批號 "${v}" 查無資料，請確認標籤` });
    } else if (b.days <= 0) {
      setScanAlert({ type: "error", msg: `批號 ${v} 已過期（${b.expiry}），系統拒絕投料` });
    } else if (b.days <= 7) {
      setScanAlert({ type: "warn", msg: `⚠ 批號 ${v} 即將到期（${b.expiry}），確定使用？` });
      setScannedBatches((p) => [...p, { batch: v, sku: b.sku, weight: b.qty / 10, time: new Date().toLocaleTimeString() }]);
    } else {
      setScannedBatches((p) => [...p, { batch: v, sku: b.sku, weight: b.qty / 10, time: new Date().toLocaleTimeString() }]);
      setScanAlert({ type: "ok", msg: `✓ 批號 ${v} 掃描成功，已加入投料清單` });
    }
    setScanInput("");
  }

  function addOutputItem() {
    setOutputItems((p) => [...p, { productId: "", productName: "", qty: 0, unit: "包" }]);
  }

  function updateOutputItem(idx: number, field: string, value: string | number) {
    setOutputItems((p) => p.map((item, i) => {
      if (i !== idx) return item;
      if (field === "productId") {
        const prod = SEMI_PRODUCTS.find((sp) => sp.id === value);
        return { ...item, productId: value as string, productName: prod?.name || "", unit: prod?.unit || "包" };
      }
      return { ...item, [field]: value };
    }));
  }

  function removeOutputItem(idx: number) {
    setOutputItems((p) => p.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    setShowSuccess(true);
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-erp-red/10 flex items-center justify-center">
            <ScanLine className="h-4 w-4 text-erp-red" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">投料作業</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="erp-green">{station}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left column: Steps 1 & 2 */}
        <div className="lg:col-span-3 space-y-5">
          {/* Step 1: Scan */}
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-erp-red/10 flex items-center justify-center text-xs font-bold text-erp-red">1</div>
                <span className="text-sm font-bold text-foreground">投料掃描 (用料確認)</span>
              </div>

              <div className="mb-4">
                <Label className="text-xs text-muted-foreground mb-1.5 block">掃描原始原料標籤</Label>
                <div className="flex gap-2">
                  <Input
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                    placeholder="掃描或輸入批號…"
                    className="flex-1 font-mono text-sm h-10 bg-background border-border"
                  />
                  <Button onClick={handleScan} className="h-10 px-4 bg-erp-red hover:bg-erp-red/90 text-white">
                    <ScanLine className="h-4 w-4 mr-1.5" />
                    掃描
                  </Button>
                </div>
              </div>

              {scanAlert && (
                <div className={cn(
                  "p-3 rounded-lg text-xs border mb-4",
                  scanAlert.type === "error" && "bg-destructive/10 border-destructive/30 text-destructive",
                  scanAlert.type === "warn" && "bg-erp-yellow/10 border-erp-yellow/30 text-erp-yellow",
                  scanAlert.type === "ok" && "bg-erp-green/10 border-erp-green/30 text-erp-green",
                )}>
                  {scanAlert.msg}
                </div>
              )}

              {/* Scanned batches list */}
              {scannedBatches.length > 0 && (
                <div className="space-y-2 mb-4">
                  {scannedBatches.map((sb, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-md bg-erp-green/5 border border-erp-green/15">
                      <div>
                        <span className="text-xs font-mono text-foreground">{sb.batch}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">{sb.sku}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{sb.weight} kg · {sb.time}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-[10px] text-muted-foreground mb-1">目前投料批號</div>
                  <div className="text-sm font-bold font-mono text-foreground">{mixBatch}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-[10px] text-muted-foreground mb-1">投入總重</div>
                  <div className="text-sm font-bold text-foreground">{totalInputWeight > 0 ? `${totalInputWeight.toFixed(2)} kg` : "10.00 kg"}</div>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground mt-3">
                試試：260101-003（正常）· 260101-004（即期警告）· XXXX（查無資料）
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Output */}
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-erp-blue/10 flex items-center justify-center text-xs font-bold text-erp-blue">2</div>
                  <span className="text-sm font-bold text-foreground">產出回報 (半成品配置)</span>
                </div>
                <Button variant="outline" size="sm" onClick={addOutputItem} className="h-8 text-xs gap-1 border-border">
                  <Plus className="h-3.5 w-3.5" />
                  新增產出項目
                </Button>
              </div>

              <div className="space-y-3">
                {outputItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-erp-green/20 bg-erp-green/[0.02]" style={{ borderLeftWidth: 4, borderLeftColor: "hsl(var(--erp-green))" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_40px] gap-3 items-end">
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">選擇商品名稱</Label>
                        <Select value={item.productId} onValueChange={(v) => updateOutputItem(idx, "productId", v)}>
                          <SelectTrigger className="h-9 text-xs bg-background border-border">
                            <SelectValue placeholder="選擇半成品…" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEMI_PRODUCTS.map((sp) => (
                              <SelectItem key={sp.id} value={sp.id} className="text-xs">{sp.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">產出包數</Label>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateOutputItem(idx, "qty", parseInt(e.target.value) || 0)}
                          className="h-9 text-xs font-mono bg-background border-border"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOutputItem(idx)}
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Label preview & Step 3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Label Date & Preview */}
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Printer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">標籤日期與預覽</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">煮製完工日期</Label>
                  <Input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="h-9 text-xs bg-background border-border"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground mb-1 block">有效期限</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-9 text-xs bg-background border-border"
                  />
                </div>
              </div>

              {/* QR Label Preview */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground">
                    標籤預覽：{outputItems[0]?.productName || "—"}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    S-260309-01 | 效期：{expiryDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Remaining material */}
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-erp-orange/10 flex items-center justify-center text-xs font-bold text-erp-orange">3</div>
                <span className="text-sm font-bold text-foreground">原料尾數回庫</span>
              </div>

              <div className="mb-4">
                <Label className="text-[10px] text-muted-foreground mb-1.5 block">剩餘原料重量 (未用完魚肉)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={remainWeight}
                    onChange={(e) => setRemainWeight(e.target.value)}
                    className="flex-1 h-10 text-sm font-mono bg-background border-border"
                  />
                  <span className="text-xs font-bold text-muted-foreground px-2">KG</span>
                </div>
              </div>

              <Separator className="my-4" />

              <Button onClick={handleSubmit} className="w-full h-11 bg-erp-green hover:bg-erp-green/90 text-white font-bold text-sm gap-2">
                <CheckCircle2 className="h-4 w-4" />
                確認產出並列印標籤
              </Button>
              <div className="text-center text-[10px] text-muted-foreground mt-2">
                半成品與原料尾數「同時入庫」
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-erp-green/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-erp-green" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">生產與尾數入庫成功</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              批號 {mixBatch} 剩餘量已回沖。<br />
              所有半成品品項已完成入庫紀錄。
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              結案並返回
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function WoOutput() {
  return (
    <div>
      <div className="text-[13px] font-bold text-foreground mb-4">成品報工入庫</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ErpCard>
          <STitle>報工資料填寫</STitle>
          <FormRow label="關聯工單" required>
            <ErpSelect className="w-full">{WOS.filter((w) => w.status === "進行中").map((w) => <option key={w.id}>{w.id} — {w.prod}</option>)}</ErpSelect>
          </FormRow>
          <FormRow label="實際產出數量" required><ErpInput type="number" placeholder="輸入成品數量" /></FormRow>
          <FormRow label="原廠批號（選填）"><ErpInput placeholder="如無則系統自動生成" /></FormRow>
          <FormRow label="入庫倉位" required>
            <ErpSelect className="w-full"><option>冷鏈倉 B (冷藏)</option><option>內倉 C</option><option>冷鏈倉 A (冷凍)</option></ErpSelect>
          </FormRow>
          <div className="rounded-lg p-3.5 mb-3.5 bg-erp-cyan/5 border border-erp-cyan/20">
            <div className="text-[10px] text-erp-cyan mb-1.5">📋 系統批號預覽（自動生成）</div>
            <div className="font-mono text-lg text-foreground tracking-[3px]">260304-006</div>
            <div className="text-[10px] text-muted-foreground mt-1">YYMMDD + 3位流水號</div>
            <div className="text-[10px] text-erp-yellow mt-1">⚠ 繼承最早到期原料效期 → 2026-03-08（魚子原料批260101-003）</div>
          </div>
          <Button variant="erp-red" className="w-full">確認報工入庫 →</Button>
        </ErpCard>
        <ErpCard>
          <STitle>近期報工記錄</STitle>
          <div className="overflow-x-auto">
            <Table>
              <ShadTableHeader><TableRow><ErpTableHeader>工單</ErpTableHeader><ErpTableHeader>成品</ErpTableHeader><ErpTableHeader>產出</ErpTableHeader><ErpTableHeader>批號</ErpTableHeader><ErpTableHeader>效期</ErpTableHeader></TableRow></ShadTableHeader>
              <TableBody>
                {[
                  { wo: "WO-0203", prod: "煙燻鱘魚套組", qty: 200, batch: "260228-002", exp: "2026-03-12" },
                  { wo: "WO-0206", prod: "鱘魚卵鹽漬罐", qty: 150, batch: "260225-002", exp: "2026-03-05" },
                  { wo: "WO-0201", prod: "魚子醬 50g", qty: 60, batch: "260304-003", exp: "2026-03-08" },
                ].map((r, i) => (
                  <TableRow key={i}>
                    <ErpTableCell mono colorClass="muted-foreground" className="text-[10px]">{r.wo}</ErpTableCell>
                    <ErpTableCell>{r.prod}</ErpTableCell>
                    <ErpTableCell colorClass="erp-green">{r.qty}</ErpTableCell>
                    <ErpTableCell mono colorClass="erp-cyan" className="text-[10px]">{r.batch}</ErpTableCell>
                    <ErpTableCell colorClass="muted-foreground">{r.exp}</ErpTableCell>
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

// ── Sort / Color Grading Inbound ──

const WAREHOUSES = [
  { id: "CB02", name: "冷鏈 B-02 (加工倉)" },
  { id: "CA01", name: "冷鏈 A-01 (原料倉)" },
  { id: "CC03", name: "內倉 C-03" },
];

const PRODUCT_OPTIONS = [
  { id: "P01", name: "鱘龍魚萃 100ml", unit: "包" },
  { id: "P02", name: "鱘龍魚精 60ml", unit: "瓶" },
  { id: "P03", name: "鱘龍骨湯底 500ml", unit: "包" },
  { id: "P04", name: "鱘龍魚油膠囊 30入", unit: "盒" },
  { id: "P05", name: "鱘龍膠原蛋白粉 50g", unit: "包" },
];

interface SortItem {
  productId: string;
  productName: string;
  weight: number;
  unit: string;
  warehouseId: string;
}

export function WoSort() {
  const [sourceBatch] = useState("WH-260306-001");
  const [sourceWeight] = useState(10);
  const [scanInput, setScanInput] = useState("");
  const [scanned, setScanned] = useState(false);

  const [items, setItems] = useState<SortItem[]>([
    { productId: "P01", productName: "鱘龍魚萃 100ml", weight: 0, unit: "包", warehouseId: "CB02" },
  ]);

  const totalWeight = useMemo(() => items.reduce((s, it) => s + (it.weight || 0), 0), [items]);
  const overWeight = totalWeight > sourceWeight;

  function handleScan() {
    if (!scanInput.trim()) return;
    setScanned(true);
    setScanInput("");
  }

  function addItem() {
    setItems(p => [...p, { productId: "", productName: "", weight: 0, unit: "kg", warehouseId: "CB02" }]);
  }

  function updateItem(idx: number, field: string, value: string | number) {
    setItems(p => p.map((it, i) => {
      if (i !== idx) return it;
      if (field === "productId") {
        const prod = PRODUCT_OPTIONS.find(o => o.id === value);
        return { ...it, productId: value as string, productName: prod?.name || "", unit: prod?.unit || "kg" };
      }
      return { ...it, [field]: value };
    }));
  }

  function removeItem(idx: number) {
    setItems(p => p.filter((_, i) => i !== idx));
  }

  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit() {
    if (items.length === 0 || overWeight) return;
    setShowSuccess(true);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-erp-blue/10 flex items-center justify-center">
            <ScanLine className="h-4 w-4 text-erp-blue" />
          </div>
          <h1 className="text-lg font-bold text-foreground">加工分色入庫</h1>
        </div>
        <Badge variant="erp-green">系統已連線</Badge>
      </div>

      <div className="space-y-5">
        {/* Step 1: Scan */}
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-erp-red/10 flex items-center justify-center text-xs font-bold text-erp-red">1</div>
              <span className="text-sm font-bold text-foreground">領料掃描與狀態</span>
            </div>

            <div className="flex gap-2 mb-4">
              <Input
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleScan()}
                placeholder="掃描領料批號…"
                className="flex-1 font-mono text-sm h-10 bg-background border-border"
              />
              <Button onClick={handleScan} className="h-10 px-4 bg-erp-red hover:bg-erp-red/90 text-white">
                <ScanLine className="h-4 w-4 mr-1.5" />
                掃描
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-[10px] text-muted-foreground mb-1">來源批號</div>
                <div className="text-sm font-bold font-mono text-foreground">{sourceBatch}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-[10px] text-muted-foreground mb-1">原始重量</div>
                <div className="text-sm font-bold text-foreground">{sourceWeight.toFixed(2)} kg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Split config */}
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-erp-blue/10 flex items-center justify-center text-xs font-bold text-erp-blue">2</div>
                <span className="text-sm font-bold text-foreground">拆分配置</span>
              </div>
              <Button variant="outline" size="sm" onClick={addItem} className="h-8 text-xs gap-1 border-border">
                <Plus className="h-3.5 w-3.5" />
                新增項目
              </Button>
            </div>

            <div className="space-y-3 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border bg-background" style={{ borderLeftWidth: 4, borderLeftColor: "hsl(var(--erp-blue))" }}>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_1fr_40px] gap-3 items-end">
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">商品名稱</Label>
                      <Select value={item.productId} onValueChange={v => updateItem(idx, "productId", v)}>
                        <SelectTrigger className="h-9 text-xs bg-background border-border">
                          <SelectValue placeholder="選擇商品…" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_OPTIONS.map(p => (
                            <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">重量 (kg)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.weight || ""}
                        onChange={e => updateItem(idx, "weight", parseFloat(e.target.value) || 0)}
                        className="h-9 text-xs font-mono bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">入庫倉位</Label>
                      <Select value={item.warehouseId} onValueChange={v => updateItem(idx, "warehouseId", v)}>
                        <SelectTrigger className="h-9 text-xs bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WAREHOUSES.map(w => (
                            <SelectItem key={w.id} value={w.id} className="text-xs">{w.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 self-end"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning */}
            {overWeight && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold mb-4">
                ⚠ 警告：總入庫重量超過原始重量！
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="p-2">
                <div className="text-[10px] text-muted-foreground">合計入庫重</div>
                <div className={cn("text-lg font-bold font-mono", overWeight ? "text-destructive" : "text-foreground")}>
                  {totalWeight.toFixed(2)} kg
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={handleSubmit}
                  disabled={items.length === 0 || overWeight || totalWeight === 0}
                  className="h-10 px-6 bg-erp-green hover:bg-erp-green/90 text-white font-bold text-sm gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  確認並一併入庫
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-erp-green/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-erp-green" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">加工分色入庫成功</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              來源批號 {sourceBatch} 已完成拆分入庫。<br />
              共 {items.length} 項品項已入庫，合計 {totalWeight.toFixed(2)} kg。
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              結案並返回
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
