import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: "active" | "inactive";
}

const initialProducts: Product[] = [
  { id: "1", name: "კოკა-კოლა 0.5ლ", sku: "BEV-001", category: "სასმელები", price: 2.50, stock: 150, unit: "ცალი", status: "active" },
  { id: "2", name: "პური თეთრი", sku: "BRD-001", category: "პურ-ფუნთუშეული", price: 1.20, stock: 80, unit: "ცალი", status: "active" },
  { id: "3", name: "რძე 1ლ", sku: "MLK-001", category: "რძის პროდუქტები", price: 3.80, stock: 45, unit: "ცალი", status: "active" },
  { id: "4", name: "ყველი სულგუნი 1კგ", sku: "CHS-001", category: "რძის პროდუქტები", price: 18.00, stock: 20, unit: "კგ", status: "active" },
  { id: "5", name: "ბანანი 1კგ", sku: "FRT-001", category: "ხილი და ბოსტნეული", price: 5.50, stock: 30, unit: "კგ", status: "active" },
  { id: "6", name: "წყალი ბორჯომი 0.5ლ", sku: "BEV-002", category: "სასმელები", price: 1.80, stock: 200, unit: "ცალი", status: "active" },
  { id: "7", name: "შაქარი 1კგ", sku: "GRC-001", category: "ბაკალეა", price: 3.20, stock: 0, unit: "კგ", status: "inactive" },
  { id: "8", name: "ზეთი მზესუმზირის 1ლ", sku: "GRC-002", category: "ბაკალეა", price: 6.50, stock: 55, unit: "ცალი", status: "active" },
];

const categories = ["სასმელები", "პურ-ფუნთუშეული", "რძის პროდუქტები", "ხილი და ბოსტნეული", "ბაკალეა", "ხორცი", "სხვა"];
const units = ["ცალი", "კგ", "ლიტრი", "შეკვრა"];

const emptyProduct: Omit<Product, "id"> = {
  name: "", sku: "", category: "", price: 0, stock: 0, unit: "ცალი", status: "active",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const { toast } = useToast();

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, sku: product.sku, category: product.category, price: product.price, stock: product.stock, unit: product.unit, status: product.status });
    setDialogOpen(true);
  };

  const openDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku || !form.category) {
      toast({ title: "შეცდომა", description: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი", variant: "destructive" });
      return;
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...form } : p));
      toast({ title: "წარმატება", description: "პროდუქტი განახლდა" });
    } else {
      const newProduct: Product = { ...form, id: Date.now().toString() };
      setProducts((prev) => [...prev, newProduct]);
      toast({ title: "წარმატება", description: "პროდუქტი დაემატა" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingProduct) {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      toast({ title: "წარმატება", description: "პროდუქტი წაიშალა" });
    }
    setDeleteDialogOpen(false);
    setDeletingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">პროდუქტები</h1>
          <p className="text-muted-foreground text-sm">მართეთ პროდუქტების კატალოგი</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          დამატება
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ძებნა..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="კატეგორია" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა კატეგორია</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>პროდუქტი</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>კატეგორია</TableHead>
              <TableHead className="text-right">ფასი</TableHead>
              <TableHead className="text-right">მარაგი</TableHead>
              <TableHead>სტატუსი</TableHead>
              <TableHead className="text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">პროდუქტები ვერ მოიძებნა</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{product.price.toFixed(2)} ₾</TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock === 0 ? "text-destructive font-medium" : product.stock < 10 ? "text-orange-500 font-medium" : ""}>
                      {product.stock} {product.unit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.status === "active" ? "default" : "outline"} className={product.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20" : ""}>
                      {product.status === "active" ? "აქტიური" : "არააქტიური"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(product)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">სულ: {filtered.length} პროდუქტი</p>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტი"}</DialogTitle>
            <DialogDescription>{editingProduct ? "შეცვალეთ პროდუქტის ინფორმაცია" : "შეავსეთ ახალი პროდუქტის მონაცემები"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>დასახელება *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="პროდუქტის დასახელება" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>SKU კოდი *</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="BEV-001" />
              </div>
              <div className="grid gap-2">
                <Label>კატეგორია *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="აირჩიეთ" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>ფასი (₾)</Label>
                <Input type="number" step="0.01" value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>მარაგი</Label>
                <Input type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>ერთეული</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>სტატუსი</Label>
              <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">აქტიური</SelectItem>
                  <SelectItem value="inactive">არააქტიური</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>გაუქმება</Button>
            <Button onClick={handleSave}>{editingProduct ? "განახლება" : "დამატება"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>პროდუქტის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              დარწმუნებული ხართ, რომ გსურთ <strong>{deletingProduct?.name}</strong>-ის წაშლა? ეს მოქმედება შეუქცევადია.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">წაშლა</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
