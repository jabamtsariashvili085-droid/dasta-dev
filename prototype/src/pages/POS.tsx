import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Barcode,
  X,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sku: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = ["ყველა", "სასმელი", "რძის პროდ.", "პური", "ხორცი", "ბოსტნეული", "სხვა"];

const products: Product[] = [
  { id: 1, name: "კოკა-კოლა 1ლ", price: 2.50, category: "სასმელი", sku: "BEV001" },
  { id: 2, name: "ბორჯომი 0.5ლ", price: 1.80, category: "სასმელი", sku: "BEV002" },
  { id: 3, name: "რძე სოფლის 1ლ", price: 3.20, category: "რძის პროდ.", sku: "DAI001" },
  { id: 4, name: "მაწონი 400გ", price: 2.10, category: "რძის პროდ.", sku: "DAI002" },
  { id: 5, name: "შოთი პური", price: 1.00, category: "პური", sku: "BRD001" },
  { id: 6, name: "ლავაში", price: 0.80, category: "პური", sku: "BRD002" },
  { id: 7, name: "ქათმის ფილე 1კგ", price: 14.50, category: "ხორცი", sku: "MEA001" },
  { id: 8, name: "ძროხის ხორცი 1კგ", price: 22.00, category: "ხორცი", sku: "MEA002" },
  { id: 9, name: "პამიდორი 1კგ", price: 4.50, category: "ბოსტნეული", sku: "VEG001" },
  { id: 10, name: "კიტრი 1კგ", price: 3.80, category: "ბოსტნეული", sku: "VEG002" },
  { id: 11, name: "კარტოფილი 1კგ", price: 2.00, category: "ბოსტნეული", sku: "VEG003" },
  { id: 12, name: "ყველი იმერული 1კგ", price: 12.00, category: "რძის პროდ.", sku: "DAI003" },
];

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("ყველა");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "ყველა" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4 -m-6 p-4">
      {/* Left: Product grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search + barcode */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="პროდუქტის ძებნა ან SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
            <Barcode className="w-4 h-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 content-start">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="pos-grid-item text-left"
            >
              <p className="text-sm font-medium text-foreground leading-tight mb-1 line-clamp-2">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground mb-2">{product.sku}</p>
              <p className="text-base font-bold text-primary">₾ {product.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 lg:w-96 flex flex-col bg-card rounded-xl border shadow-[var(--shadow-card)] flex-shrink-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-foreground">
            კალათა
            {cart.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </Badge>
            )}
          </h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-destructive hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> გასუფთავება
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCartEmpty />
              <p className="text-sm mt-2">კალათა ცარიელია</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₾ {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-md bg-card border flex items-center justify-center hover:bg-secondary"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-md bg-card border flex items-center justify-center hover:bg-secondary"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right w-16">
                  <p className="text-sm font-semibold text-foreground">
                    ₾ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Totals + Payment */}
        <div className="border-t p-4 space-y-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>ქვეჯამი</span>
              <span>₾ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>დღგ (18%)</span>
              <span>₾ {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t">
              <span>სულ</span>
              <span>₾ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-11 gap-2" disabled={cart.length === 0}>
              <Banknote className="w-4 h-4" />
              ნაღდი
            </Button>
            <Button className="h-11 gap-2" disabled={cart.length === 0}>
              <CreditCard className="w-4 h-4" />
              ბარათი
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ShoppingCartEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export default POS;
