"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PRODS, BATCHES } from "@/lib/data/mock-data";
import { ScanBarcode, CheckCircle2, Search, Package } from "lucide-react";

const WAREHOUSES = ["冷鏈A-01", "冷鏈A-02", "冷鏈B-02", "內倉C-01", "內倉C-03", "常溫C-01"];
const UNITS = ["箱", "包", "罐", "公斤", "個"];

interface InboundRecord {
  batch: string;
  sku: string;
  name: string;
  expiry: string;
  qty: number;
  unit: string;
  warehouse: string;
}

export const WhInbound = () => {
  const [scanInput, setScanInput] = useState("");
  const [scanned, setScanned] = useState(false);

  // Form fields
  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productionDate, setProductionDate] = useState("2026-03-04");
  const [factoryCode, setFactoryCode] = useState("FAC-02");
  const [woNumber, setWoNumber] = useState("WO-88901");
  const [inboundDatetime, setInboundDatetime] = useState("2026-03-06 16:30");
  const [weight, setWeight] = useState("500");
  const [qty, setQty] = useState("200");
  const [unit, setUnit] = useState("包");
  const [warehouse, setWarehouse] = useState("冷鏈A-02");
  const [expiryDate, setExpiryDate] = useState("2026-04-30");

  const [records, setRecords] = useState<InboundRecord[]>([
    { batch: "260304-001", sku: "SKU-F001", name: "新鮮鱘魚片 500g", expiry: "2026-04-30", qty: 200, unit: "包", warehouse: "冷鏈A-02" },
  ]);

  const [successOpen, setSuccessOpen] = useState(false);
  const [lastRecord, setLastRecord] = useState<InboundRecord | null>(null);

  const handleScan = () => {
    if (!scanInput.trim()) return;
    // Mock: simulate barcode scan resolving to a product
    const matched = PRODS.find(p => p.sku === scanInput.trim() || p.name.includes(scanInput.trim()));
    if (matched) {
      setProductName(matched.name);
      setProductSku(matched.sku);
      setScanned(true);
    } else {
      // Default mock scan
      setProductName("新鮮鱘魚片 500g");
      setProductSku("SKU-F001");
      setScanned(true);
    }
  };

  const handleSelectProduct = (name: string) => {
    setProductName(name);
    const p = PRODS.find(pr => pr.name === name);
    if (p) setProductSku(p.sku);
  };

  const handleConfirmInbound = () => {
    const batchId = `${productionDate.replace(/-/g, "").slice(2)}-${String(records.length + 1).padStart(3, "0")}`;
    const newRecord: InboundRecord = {
      batch: batchId,
      sku: productSku,
      name: productName,
      expiry: expiryDate,
      qty: Number(qty),
      unit,
      warehouse,
    };
    setRecords(prev => [newRecord, ...prev]);
    setLastRecord(newRecord);
    setSuccessOpen(true);
    // Reset
    setScanInput("");
    setScanned(false);
    setProductName("");
    setProductSku("");
    setWeight("500");
    setQty("200");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ScanBarcode className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">貨物入庫掃碼</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Scan input */}
        <Card className="lg:w-72 flex-shrink-0">
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">請掃描商品條碼或手動輸入</p>
            <div className="flex gap-2">
              <Input
                placeholder="掃描條碼內容..."
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleScan()}
                className="flex-1"
              />
              <Button size="icon" variant="outline" onClick={handleScan}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              解析後請確認右側數值、<br />單位及到期日是否正確。
            </p>
            {scanned && (
              <Badge className="bg-primary/10 text-primary border-primary/30">
                ✓ 條碼已解析
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Right: Label info form */}
        <Card className="flex-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-erp-orange flex items-center gap-2">
              <Package className="h-4 w-4" />
              待確認標籤資訊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Product name - searchable */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">商品名稱 (可搜尋)</Label>
                <Select value={productName} onValueChange={handleSelectProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="搜尋或選擇商品" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODS.map(p => (
                      <SelectItem key={p.sku} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">產品編號 (唯一碼)</Label>
                <div className="h-10 flex items-center text-erp-orange font-bold text-base">{productSku || "—"}</div>
              </div>

              {/* Production date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">生產日</Label>
                <Input type="date" value={productionDate} onChange={e => setProductionDate(e.target.value)} />
              </div>

              {/* Factory code */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">工廠代號</Label>
                <Input value={factoryCode} onChange={e => setFactoryCode(e.target.value)} />
              </div>

              {/* WO number */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">工單號</Label>
                <Input value={woNumber} onChange={e => setWoNumber(e.target.value)} />
              </div>

              {/* Inbound datetime */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">入庫日期時間</Label>
                <Input value={inboundDatetime} onChange={e => setInboundDatetime(e.target.value)} />
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">重量 (g)</Label>
                <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>

              {/* Qty + Unit */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">數量 / 單位</Label>
                <div className="flex gap-2">
                  <Input type="number" value={qty} onChange={e => setQty(e.target.value)} className="flex-[2]" />
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(u => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Empty spacer for alignment on lg */}
              <div className="hidden lg:block" />

              {/* Warehouse */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">選擇倉位</Label>
                <Select value={warehouse} onValueChange={setWarehouse}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WAREHOUSES.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Expiry date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">到期日 (效期)</Label>
                <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-end">
              <Button
                onClick={handleConfirmInbound}
                disabled={!productName || !qty}
                className="px-8"
              >
                確認正式入庫
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">近期入庫資訊</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>批號 / SKU</TableHead>
                <TableHead>商品名稱</TableHead>
                <TableHead className="text-center">到期日</TableHead>
                <TableHead className="text-center">入庫數量</TableHead>
                <TableHead className="text-center">倉位</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-erp-orange font-semibold">{r.batch}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{r.expiry}</TableCell>
                  <TableCell className="text-center text-erp-green font-semibold">{r.qty} {r.unit}</TableCell>
                  <TableCell className="text-center">{r.warehouse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-erp-green" />
              入庫成功
            </DialogTitle>
          </DialogHeader>
          {lastRecord && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>{lastRecord.name}</strong></p>
              <p>批號 {lastRecord.batch} ｜ {lastRecord.qty} {lastRecord.unit} → {lastRecord.warehouse}</p>
            </div>
          )}
          <Button onClick={() => setSuccessOpen(false)} className="mt-2">確定</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
