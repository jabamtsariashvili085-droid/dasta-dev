import { useState } from "react";
import { Package, ArrowDownToLine, ArrowUpFromLine, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  location: string;
}

interface StockMovement {
  id: string;
  date: string;
  productName: string;
  sku: string;
  type: "in" | "out";
  quantity: number;
  unit: string;
  reason: string;
  note: string;
}

const initialStock: StockItem[] = [
  { id: "1", name: "კოკა-კოლა 0.5ლ", sku: "BEV-001", category: "სასმელები", currentStock: 150, minStock: 50, unit: "ცალი", location: "A-1-01" },
  { id: "2", name: "პური თეთრი", sku: "BRD-001", category: "პურ-ფუნთუშეული", currentStock: 80, minStock: 20, unit: "ცალი", location: "B-2-03" },
  { id: "3", name: "რძე 1ლ", sku: "MLK-001", category: "რძის პროდუქტები", currentStock: 45, minStock: 30, unit: "ცალი", location: "C-1-02" },
  { id: "4", name: "ყველი სულგუნი 1კგ", sku: "CHS-001", category: "რძის პროდუქტები", currentStock: 20, minStock: 10, unit: "კგ", location: "C-1-05" },
  { id: "5", name: "ბანანი 1კგ", sku: "FRT-001", category: "ხილი და ბოსტნეული", currentStock: 30, minStock: 15, unit: "კგ", location: "D-1-01" },
  { id: "6", name: "წყალი ბორჯომი 0.5ლ", sku: "BEV-002", category: "სასმელები", currentStock: 200, minStock: 80, unit: "ცალი", location: "A-1-02" },
  { id: "7", name: "შაქარი 1კგ", sku: "GRC-001", category: "ბაკალეა", currentStock: 0, minStock: 20, unit: "კგ", location: "E-2-01" },
  { id: "8", name: "ზეთი მზესუმზირის 1ლ", sku: "GRC-002", category: "ბაკალეა", currentStock: 55, minStock: 25, unit: "ცალი", location: "E-2-03" },
];

const initialMovements: StockMovement[] = [
  { id: "1", date: "2026-03-02 14:30", productName: "კოკა-კოლა 0.5ლ", sku: "BEV-001", type: "in", quantity: 100, unit: "ცალი", reason: "შემოსვლა", note: "მომწოდებელი: კოკა-კოლა" },
  { id: "2", date: "2026-03-02 12:15", productName: "პური თეთრი", sku: "BRD-001", type: "out", quantity: 20, unit: "ცალი", reason: "გაყიდვა", note: "POS გაყიდვა" },
  { id: "3", date: "2026-03-01 16:45", productName: "რძე 1ლ", sku: "MLK-001", type: "in", quantity: 50, unit: "ცალი", reason: "შემოსვლა", note: "მომწოდებელი: სანტე" },
  { id: "4", date: "2026-03-01 10:00", productName: "შაქარი 1კგ", sku: "GRC-001", type: "out", quantity: 30, unit: "კგ", reason: "ჩამოწერა", note: "ვადაგასული" },
  { id: "5", date: "2026-02-28 09:30", productName: "ყველი სულგუნი 1კგ", sku: "CHS-001", type: "in", quantity: 15, unit: "კგ", reason: "შემოსვლა", note: "მომწოდებელი: სოფლის პროდუქტი" },
  { id: "6", date: "2026-02-28 08:00", productName: "წყალი ბორჯომი 0.5ლ", sku: "BEV-002", type: "out", quantity: 50, unit: "ცალი", reason: "გაყიდვა", note: "საბითუმო შეკვეთა" },
];

const movementReasons = {
  in: ["შემოსვლა", "დაბრუნება", "ინვენტარიზაცია", "ტრანსფერი"],
  out: ["გაყიდვა", "ჩამოწერა", "დაზიანება", "ტრანსფერი"],
};

export default function Warehouse() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [search, setSearch] = useState("");
  const [movementSearch, setMovementSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<"in" | "out">("in");
  const [form, setForm] = useState({ productId: "", quantity: 0, reason: "", note: "" });
  const { toast } = useToast();

  const lowStockCount = stock.filter((s) => s.currentStock <= s.minStock && s.currentStock > 0).length;
  const outOfStockCount = stock.filter((s) => s.currentStock === 0).length;
  const totalItems = stock.reduce((sum, s) => sum + s.currentStock, 0);

  const filteredStock = stock.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.sku.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMovements = movements.filter((m) =>
    m.productName.toLowerCase().includes(movementSearch.toLowerCase()) || m.sku.toLowerCase().includes(movementSearch.toLowerCase())
  );

  const openMovement = (type: "in" | "out") => {
    setMovementType(type);
    setForm({ productId: "", quantity: 0, reason: "", note: "" });
    setDialogOpen(true);
  };

  const handleMovement = () => {
    if (!form.productId || !form.quantity || !form.reason) {
      toast({ title: "შეცდომა", description: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი", variant: "destructive" });
      return;
    }

    const product = stock.find((s) => s.id === form.productId);
    if (!product) return;

    if (movementType === "out" && form.quantity > product.currentStock) {
      toast({ title: "შეცდომა", description: "არასაკმარისი მარაგი", variant: "destructive" });
      return;
    }

    setStock((prev) =>
      prev.map((s) =>
        s.id === form.productId
          ? { ...s, currentStock: movementType === "in" ? s.currentStock + form.quantity : s.currentStock - form.quantity }
          : s
      )
    );

    const newMovement: StockMovement = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("ka-GE"),
      productName: product.name,
      sku: product.sku,
      type: movementType,
      quantity: form.quantity,
      unit: product.unit,
      reason: form.reason,
      note: form.note,
    };
    setMovements((prev) => [newMovement, ...prev]);

    toast({ title: "წარმატება", description: movementType === "in" ? "მარაგი შეივსო" : "მარაგი ჩამოიწერა" });
    setDialogOpen(false);
  };

  const getStockBadge = (item: StockItem) => {
    if (item.currentStock === 0)
      return <Badge variant="destructive">ამოწურულია</Badge>;
    if (item.currentStock <= item.minStock)
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20">დაბალი</Badge>;
    return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">ნორმალური</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">საწყობი</h1>
          <p className="text-muted-foreground text-sm">მარაგების მართვა და მოძრაობის ისტორია</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openMovement("in")} className="gap-2">
            <ArrowDownToLine className="w-4 h-4" />
            შემოსვლა
          </Button>
          <Button onClick={() => openMovement("out")} variant="outline" className="gap-2">
            <ArrowUpFromLine className="w-4 h-4" />
            გასვლა
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">სულ ერთეული</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">დაბალი მარაგი</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ამოწურულია</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{outOfStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">მარაგები</TabsTrigger>
          <TabsTrigger value="history">მოძრაობის ისტორია</TabsTrigger>
        </TabsList>

        {/* Stock Tab */}
        <TabsContent value="stock" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="ძებნა..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>პროდუქტი</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>ადგილმდებარეობა</TableHead>
                  <TableHead className="text-right">მარაგი</TableHead>
                  <TableHead className="text-right">მინიმუმი</TableHead>
                  <TableHead>სტატუსი</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">პროდუქტები ვერ მოიძებნა</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{item.location}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{item.currentStock} {item.unit}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.minStock} {item.unit}</TableCell>
                      <TableCell>{getStockBadge(item)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="ძებნა..." value={movementSearch} onChange={(e) => setMovementSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>თარიღი</TableHead>
                  <TableHead>ტიპი</TableHead>
                  <TableHead>პროდუქტი</TableHead>
                  <TableHead className="text-right">რაოდენობა</TableHead>
                  <TableHead>მიზეზი</TableHead>
                  <TableHead>შენიშვნა</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <p className="text-muted-foreground">მოძრაობები ვერ მოიძებნა</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-muted-foreground text-sm">{m.date}</TableCell>
                      <TableCell>
                        <Badge className={m.type === "in"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20"
                        }>
                          {m.type === "in" ? (
                            <><ArrowDownToLine className="w-3 h-3 mr-1" /> შემოსვლა</>
                          ) : (
                            <><ArrowUpFromLine className="w-3 h-3 mr-1" /> გასვლა</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{m.productName}</TableCell>
                      <TableCell className="text-right font-medium">{m.quantity} {m.unit}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-normal">{m.reason}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{m.note}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Movement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{movementType === "in" ? "მარაგის შემოსვლა" : "მარაგის გასვლა"}</DialogTitle>
            <DialogDescription>{movementType === "in" ? "დაამატეთ პროდუქტი საწყობში" : "ჩამოწერეთ პროდუქტი საწყობიდან"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>პროდუქტი *</Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                <SelectTrigger><SelectValue placeholder="აირჩიეთ პროდუქტი" /></SelectTrigger>
                <SelectContent>
                  {stock.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} ({s.currentStock} {s.unit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>რაოდენობა *</Label>
                <Input type="number" min={1} value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>მიზეზი *</Label>
                <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v })}>
                  <SelectTrigger><SelectValue placeholder="აირჩიეთ" /></SelectTrigger>
                  <SelectContent>
                    {movementReasons[movementType].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>შენიშვნა</Label>
              <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="დამატებითი ინფორმაცია..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>გაუქმება</Button>
            <Button onClick={handleMovement}>{movementType === "in" ? "შემოტანა" : "გატანა"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
