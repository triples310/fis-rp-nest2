"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Search, ChevronDown, ChevronLeft, ChevronRight, X, Pencil, Trash2, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──
interface BomItem {
  sku: string;
  qty: number;
  unit: string;
}

interface Product {
  sku: string;
  name: string;
  barcode: string;
  type: "原料" | "半成品" | "庫存商品";
  brand: string;
  temperature: string;
  unit: string;
  categories: string[];
  suppliers: string[];
  countries: string[];
  listPrice: number;
  sellPrice: number;
  bom: BomItem[];
  note: string;
}

// ── Config data types ──
interface ConfigItem {
  code: string;
  name: string;
}

type ConfigTab = "brand" | "category" | "supplier" | "unit";

// ── Initial Data ──
const INITIAL_PRODUCTS: Product[] = [
  { sku: "SKU-F001", name: "頂級魚子醬禮盒 (2罐入)", barcode: "", type: "原料", brand: "鱘寶", temperature: "冷藏", unit: "罐", categories: ["禮盒組"], suppliers: ["漁業合作社"], countries: ["台灣"], listPrice: 880, sellPrice: 750, bom: [], note: "" },
  { sku: "SKU-F002", name: "濃縮鱘魚萃取液 30入盒裝", barcode: "", type: "原料", brand: "捷昌", temperature: "常溫", unit: "盒", categories: [], suppliers: [], countries: [], listPrice: 650, sellPrice: 620, bom: [], note: "" },
  { sku: "SKU-F003", name: "煙燻鱘魚片隨手包", barcode: "", type: "原料", brand: "鱘寶", temperature: "冷藏", unit: "包", categories: [], suppliers: [], countries: [], listPrice: 380, sellPrice: 380, bom: [], note: "" },
  { sku: "SKU-F004", name: "鱘魚精華美妝組", barcode: "", type: "原料", brand: "鱘寶", temperature: "常溫", unit: "組", categories: [], suppliers: [], countries: [], listPrice: 1200, sellPrice: 1100, bom: [], note: "" },
  { sku: "SKU-F005", name: "海鮮精選組合 6件套", barcode: "", type: "原料", brand: "鱘寶", temperature: "冷凍", unit: "套", categories: [], suppliers: [], countries: [], listPrice: 4200, sellPrice: 3980, bom: [], note: "" },
  { sku: "SKU-S001", name: "醃製熟成魚卵 (kg)", barcode: "", type: "半成品", brand: "鱘寶", temperature: "冷藏", unit: "kg", categories: [], suppliers: [], countries: [], listPrice: 560, sellPrice: 560, bom: [{ sku: "SKU-F001", qty: 2, unit: "罐" }], note: "" },
  { sku: "SKU-S002", name: "鱘魚骨粗製萃取液", barcode: "", type: "半成品", brand: "捷昌", temperature: "冷藏", unit: "瓶", categories: [], suppliers: [], countries: [], listPrice: 320, sellPrice: 320, bom: [], note: "" },
  { sku: "SKU-S003", name: "調味切片魚肉", barcode: "", type: "半成品", brand: "鱘寶", temperature: "冷凍", unit: "kg", categories: [], suppliers: [], countries: [], listPrice: 280, sellPrice: 280, bom: [], note: "" },
  { sku: "SKU-S004", name: "特調沾醬配方基底", barcode: "", type: "半成品", brand: "鱘寶", temperature: "常溫", unit: "瓶", categories: [], suppliers: [], countries: [], listPrice: 150, sellPrice: 150, bom: [], note: "" },
  { sku: "SKU-S005", name: "低溫烘乾魚皮 (kg)", barcode: "", type: "半成品", brand: "鱘寶", temperature: "常溫", unit: "kg", categories: [], suppliers: [], countries: [], listPrice: 200, sellPrice: 200, bom: [], note: "" },
  { sku: "SKU-R001", name: "魚卵原始原料 (冷凍)", barcode: "", type: "庫存商品", brand: "鱘寶", temperature: "冷凍", unit: "kg", categories: [], suppliers: ["漁業合作社"], countries: ["台灣"], listPrice: 180, sellPrice: 180, bom: [], note: "" },
  { sku: "SKU-R002", name: "品牌精裝禮盒空盒", barcode: "", type: "庫存商品", brand: "鱘寶", temperature: "常溫", unit: "個", categories: [], suppliers: [], countries: [], listPrice: 45, sellPrice: 45, bom: [], note: "" },
  { sku: "SKU-R003", name: "玻璃密封罐 50ml", barcode: "", type: "庫存商品", brand: "", temperature: "常溫", unit: "個", categories: [], suppliers: [], countries: [], listPrice: 12, sellPrice: 12, bom: [], note: "" },
  { sku: "SKU-R004", name: "真空鋁箔包裝袋 (小)", barcode: "", type: "庫存商品", brand: "", temperature: "常溫", unit: "個", categories: [], suppliers: [], countries: [], listPrice: 3, sellPrice: 3, bom: [], note: "" },
  { sku: "SKU-R005", name: "純淨飲用水原料", barcode: "", type: "庫存商品", brand: "", temperature: "常溫", unit: "桶", categories: [], suppliers: [], countries: [], listPrice: 50, sellPrice: 50, bom: [], note: "" },
];

const TYPE_BADGE: Record<string, string> = {
  "原料": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  "半成品": "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  "庫存商品": "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
};

const TYPES: Product["type"][] = ["原料", "半成品", "庫存商品"];
const TEMP_OPTIONS = ["常溫", "冷藏", "冷凍"];

// ── Main Export ──
export function ProdList() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Config data (shared across modals)
  const [configData, setConfigData] = useState<Record<ConfigTab, ConfigItem[]>>({
    brand: [{ code: "BRD-01", name: "鱘寶" }, { code: "BRD-02", name: "捷昌" }],
    category: [{ code: "CAT-01", name: "禮盒組" }],
    supplier: [{ code: "SUP-01", name: "漁業合作社" }],
    unit: [{ code: "-", name: "罐" }, { code: "-", name: "kg" }, { code: "-", name: "個" }, { code: "-", name: "盒" }],
  });

  const filtered = useMemo(() => {
    let list = products;
    if (typeFilter !== "all") list = list.filter((p) => p.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleNew = () => {
    const nextNum = products.length + 1;
    setEditProduct({
      sku: `SKU-NEW-${String(nextNum).padStart(3, "0")}`, name: "", barcode: "", type: "原料",
      brand: "", temperature: "常溫", unit: "個", categories: [], suppliers: [], countries: [],
      listPrice: 0, sellPrice: 0, bom: [], note: "",
    });
    setIsNew(true);
  };

  const handleSave = (p: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.sku === p.sku);
      if (idx >= 0) { const next = [...prev]; next[idx] = p; return next; }
      return [...prev, p];
    });
    setEditProduct(null);
    setIsNew(false);
  };

  const handleDelete = useCallback((sku: string) => {
    if (window.confirm(`確定要刪除商品 ${sku} 嗎？`)) {
      setProducts((prev) => prev.filter((p) => p.sku !== sku));
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">商品主檔管理</h1>
            <p className="text-xs text-muted-foreground mt-0.5">原料、半成品與庫存商品配方管理系統</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setShowConfig(true)}>
              <Settings className="h-3.5 w-3.5" /> 參數設定
            </Button>
            <Button size="sm" className="gap-1.5 text-xs" onClick={handleNew}>
              <Plus className="h-3.5 w-3.5" /> 新增商品
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3">
          <Tabs value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs px-3 py-1.5">全部</TabsTrigger>
              {TYPES.map((t) => (
                <TabsTrigger key={t} value={t} className="text-xs px-3 py-1.5">{t}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋 SKU 或商品名稱..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-auto min-h-0 px-4">
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold whitespace-nowrap">SKU 編號</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap">商品名稱</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-center">類型</TableHead>
                  <TableHead className="text-xs font-semibold whitespace-nowrap text-center w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.sku} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-xs font-mono font-semibold text-primary whitespace-nowrap">{p.sku}</TableCell>
                    <TableCell className="text-xs font-semibold">{p.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("text-[10px]", TYPE_BADGE[p.type])}>{p.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                            動作 <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditProduct(p); setIsNew(false); }}>
                            <Pencil className="h-3.5 w-3.5 mr-2" /> 編輯
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.sku)}>
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> 刪除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                      無符合條件的商品
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Pagination */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>每頁顯示</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[70px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>項記錄</span>
          <span className="ml-2">共 {filtered.length} 筆</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {generatePageNumbers(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`e-${i}`} className="px-1 text-xs text-muted-foreground">...</span>
            ) : (
              <Button key={p} variant={p === safePage ? "default" : "outline"} size="sm" className="h-8 w-8 p-0 text-xs" onClick={() => setCurrentPage(p as number)}>{p}</Button>
            )
          )}
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Modal */}
      {editProduct && (
        <ProductModal
          product={editProduct}
          isNew={isNew}
          configData={configData}
          allProducts={products}
          onClose={() => { setEditProduct(null); setIsNew(false); }}
          onSave={handleSave}
        />
      )}

      {/* Config Modal */}
      {showConfig && (
        <ConfigModal
          data={configData}
          onChange={setConfigData}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}

// ── Page Numbers ──
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

// ── Product Modal ──
function ProductModal({
  product, isNew, configData, allProducts, onClose, onSave,
}: {
  product: Product; isNew: boolean; configData: Record<ConfigTab, ConfigItem[]>; allProducts: Product[];
  onClose: () => void; onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>({ ...product, bom: product.bom.map((b) => ({ ...b })), categories: [...product.categories], suppliers: [...product.suppliers], countries: [...product.countries] });

  const update = <K extends keyof Product>(key: K, val: Product[K]) => setForm((p) => ({ ...p, [key]: val }));

  const updateBom = (idx: number, field: keyof BomItem, val: string | number) => {
    setForm((prev) => {
      const bom = prev.bom.map((b, i) => i === idx ? { ...b, [field]: typeof b[field] === "number" ? Number(val) || 0 : val } : b);
      return { ...prev, bom };
    });
  };

  const addBom = () => setForm((p) => ({ ...p, bom: [...p.bom, { sku: "", qty: 1, unit: "kg" }] }));
  const removeBom = (idx: number) => setForm((p) => ({ ...p, bom: p.bom.filter((_, i) => i !== idx) }));

  const addMulti = (field: "categories" | "suppliers" | "countries") =>
    setForm((p) => ({ ...p, [field]: [...p[field], ""] }));
  const updateMulti = (field: "categories" | "suppliers" | "countries", idx: number, val: string) =>
    setForm((p) => ({ ...p, [field]: p[field].map((v, i) => (i === idx ? val : v)) }));
  const removeMulti = (field: "categories" | "suppliers" | "countries", idx: number) =>
    setForm((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-sm font-semibold">
            {isNew ? "新增商品" : `編輯：${form.name}`}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto min-h-0">
          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label className="text-[10px] text-muted-foreground mb-1 block">商品名稱</Label>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 text-sm font-semibold" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">SKU 編號</Label>
              <Input value={form.sku} onChange={(e) => update("sku", e.target.value)} readOnly={!isNew} className={cn("h-9 text-sm font-mono text-primary", !isNew && "bg-muted")} />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">國際條碼</Label>
              <Input value={form.barcode} onChange={(e) => update("barcode", e.target.value)} className="h-9 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">類型</Label>
              <Select value={form.type} onValueChange={(v) => update("type", v as Product["type"])}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">品牌</Label>
              <Select value={form.brand} onValueChange={(v) => update("brand", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="選擇品牌" /></SelectTrigger>
                <SelectContent>{configData.brand.map((b) => <SelectItem key={b.name} value={b.name} className="text-sm">{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">溫層</Label>
              <Select value={form.temperature} onValueChange={(v) => update("temperature", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{TEMP_OPTIONS.map((t) => <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">單位</Label>
              <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{configData.unit.map((u) => <SelectItem key={u.name} value={u.name} className="text-sm">{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Multi-select fields */}
          <div className="grid grid-cols-3 gap-4">
            <MultiField label="類別 (多選)" items={form.categories} options={configData.category.map((c) => c.name)} onAdd={() => addMulti("categories")} onUpdate={(i, v) => updateMulti("categories", i, v)} onRemove={(i) => removeMulti("categories", i)} />
            <MultiField label="供應商 (多選)" items={form.suppliers} options={configData.supplier.map((s) => s.name)} onAdd={() => addMulti("suppliers")} onUpdate={(i, v) => updateMulti("suppliers", i, v)} onRemove={(i) => removeMulti("suppliers", i)} />
            <MultiField label="國家 (多選)" items={form.countries} options={["台灣", "日本", "法國", "伊朗", "義大利"]} onAdd={() => addMulti("countries")} onUpdate={(i, v) => updateMulti("countries", i, v)} onRemove={(i) => removeMulti("countries", i)} />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">定價</Label>
              <Input type="number" value={form.listPrice || ""} onChange={(e) => update("listPrice", Number(e.target.value) || 0)} className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground mb-1 block">售價</Label>
              <Input type="number" value={form.sellPrice || ""} onChange={(e) => update("sellPrice", Number(e.target.value) || 0)} className="h-9 text-sm text-destructive font-semibold" />
            </div>
          </div>

          {/* BOM */}
          <Card className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold">BOM 組合配方</span>
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={addBom}>
                  <Plus className="h-3 w-3" /> 新增項目
                </Button>
              </div>
              {form.bom.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">尚無 BOM 項目</p>
              )}
              {form.bom.map((b, idx) => (
                <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_36px] gap-3 mb-2 items-center bg-background p-2.5 rounded-lg border border-border">
                  <Input value={b.sku} onChange={(e) => updateBom(idx, "sku", e.target.value)} placeholder="搜尋 SKU..." className="h-8 text-xs" />
                  <Input type="number" value={b.qty || ""} onChange={(e) => updateBom(idx, "qty", e.target.value)} className="h-8 text-xs text-center" />
                  <Select value={b.unit} onValueChange={(v) => updateBom(idx, "unit", v)}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{configData.unit.map((u) => <SelectItem key={u.name} value={u.name} className="text-xs">{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeBom(idx)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Note */}
          <div>
            <Label className="text-[10px] text-muted-foreground mb-1 block">備註說明</Label>
            <Textarea value={form.note} onChange={(e) => update("note", e.target.value)} className="text-xs min-h-[60px] resize-none" placeholder="內部備註或規格說明..." />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={() => onSave(form)}>確認儲存商品</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Multi-select Field ──
function MultiField({
  label, items, options, onAdd, onUpdate, onRemove,
}: {
  label: string; items: string[]; options: string[];
  onAdd: () => void; onUpdate: (i: number, v: string) => void; onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground" onClick={onAdd}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-1.5">
        {items.map((val, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <Select value={val} onValueChange={(v) => onUpdate(idx, v)}>
              <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder="選擇..." /></SelectTrigger>
              <SelectContent>{options.map((o) => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => onRemove(idx)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-[10px] text-muted-foreground">尚未選擇</p>}
      </div>
    </div>
  );
}

// ── Config Modal ──
function ConfigModal({
  data, onChange, onClose,
}: {
  data: Record<ConfigTab, ConfigItem[]>;
  onChange: (d: Record<ConfigTab, ConfigItem[]>) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ConfigTab>("brand");
  const [search, setSearch] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  const TAB_LABELS: Record<ConfigTab, string> = { brand: "品牌管理", category: "分類管理", supplier: "供應商管理", unit: "單位管理" };
  const isUnit = activeTab === "unit";

  const items = useMemo(() => {
    if (!search) return data[activeTab];
    const q = search.toLowerCase();
    return data[activeTab].filter((i) => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
  }, [data, activeTab, search]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const updated = { ...data, [activeTab]: [...data[activeTab], { code: isUnit ? "-" : newCode || "-", name: newName.trim() }] };
    onChange(updated);
    setNewCode("");
    setNewName("");
  };

  const handleRemove = (idx: number) => {
    const realIdx = data[activeTab].indexOf(items[idx]);
    if (realIdx < 0) return;
    const updated = { ...data, [activeTab]: data[activeTab].filter((_, i) => i !== realIdx) };
    onChange(updated);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-sm font-semibold">基礎參數管理</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-border px-6 shrink-0">
          <div className="flex gap-0">
            {(Object.keys(TAB_LABELS) as ConfigTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearch(""); }}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Add + Search */}
        <div className="px-6 py-3 border-b border-border space-y-3 shrink-0 bg-muted/30">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="搜尋此類別內容..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-8 text-xs" />
          </div>
          <div className="flex items-center gap-2">
            {!isUnit && <Input placeholder="編號" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="h-8 text-xs w-28" />}
            <Input placeholder="名稱" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-8 text-xs flex-1" />
            <Button size="sm" className="h-8 text-xs gap-1" onClick={handleAdd}>
              <Plus className="h-3 w-3" /> 新增項目
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold w-14">項次</TableHead>
                {!isUnit && <TableHead className="text-xs font-semibold w-32">編號</TableHead>}
                <TableHead className="text-xs font-semibold">名稱</TableHead>
                <TableHead className="text-xs font-semibold text-center w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                  {!isUnit && <TableCell className="text-xs font-semibold">{item.code}</TableCell>}
                  <TableCell className="text-xs">{item.name}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] text-destructive hover:text-destructive" onClick={() => handleRemove(idx)}>
                      移除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isUnit ? 3 : 4} className="text-center py-8 text-muted-foreground text-sm">無資料</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
          <Button onClick={onClose}>完成儲存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
