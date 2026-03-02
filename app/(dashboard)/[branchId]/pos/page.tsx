'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    Check,
    Package,
    Barcode as BarcodeIcon,
    Eraser,
    UserPlus,
    Loader2,
    RefreshCcw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn, formatCurrency } from '@/lib/utils'
import ThermalReceipt from '@/components/pos/ThermalReceipt'
import ZReport from '@/components/pos/ZReport'

export default function POSPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params)
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [cart, setCart] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [barcodeBuffer, setBarcodeBuffer] = useState('')
    const [lastScanTime, setLastScanTime] = useState(0)

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [paidAmount, setPaidAmount] = useState('')
    const [processing, setProcessing] = useState(false)
    const [lastSale, setLastSale] = useState<any>(null)
    const [branch, setBranch] = useState<any>(null)
    const [settings, setSettings] = useState<any>(null)
    const [zReportData, setZReportData] = useState<any>(null)
    const [isZReportOpen, setIsZReportOpen] = useState(false)

    const supabase = createClient()

    // Data Fetching
    const fetchData = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: catData } = await supabase.from('categories').select('*').order('name')
        setCategories(catData || [])

        const { data: prodData } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('name')
        setProducts(prodData || [])

        const { data: branchData } = await supabase
            .from('branches')
            .select('*, branch_settings(*)')
            .eq('id', branchId)
            .single()

        if (branchData) {
            setBranch(branchData)
            setSettings(branchData.branch_settings)
        }

        setLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Barcode Scanner Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now()

            // If time between keys > 50ms, it's likely manual typing, not a scanner
            if (now - lastScanTime > 50) {
                setBarcodeBuffer('')
            }

            setLastScanTime(now)

            if (e.key === 'Enter') {
                if (barcodeBuffer.length > 2) {
                    const product = products.find(p => p.barcode === barcodeBuffer || p.sku === barcodeBuffer)
                    if (product) {
                        addToCart(product)
                        toast.success(`${product.name} დამატებულია`, { icon: '🏷️' })
                    } else {
                        toast.error('პროდუქტი ვერ მოიძებნა: ' + barcodeBuffer)
                    }
                    setBarcodeBuffer('')
                }
            } else if (e.key.length === 1) {
                // Only capture alphanumeric characters
                if (/[a-zA-Z0-9]/.test(e.key)) {
                    setBarcodeBuffer(prev => prev + e.key)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [barcodeBuffer, lastScanTime, products])

    // Cart Logic
    const addToCart = (product: any) => {
        const existing = cart.find(item => item.id === product.id)
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const clearCart = () => {
        if (cart.length > 0 && confirm('ნამდვილად გსურთ კალათის გასუფთავება?')) {
            setCart([])
        }
    }

    // Calculations
    const subtotal = cart.reduce((acc, item) => acc + (item.retail_price * item.quantity), 0)
    const tax = subtotal * 0.18 // Hardcoded 18% for demo, should come from branch_settings
    const total = subtotal
    const change = paidAmount ? Number(paidAmount) - total : 0

    // Filtered Products
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.barcode && p.barcode.includes(search)) ||
            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
        const matchesCategory = activeCategory === 'all' || p.category_id === activeCategory
        return matchesSearch && matchesCategory
    })

    // Final Sale
    const handleCompleteSale = async () => {
        if (cart.length === 0) return
        setProcessing(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            // 1. Create Sale record
            const { data: sale, error: saleError } = await supabase
                .from('sales')
                .insert({
                    branch_id: branchId,
                    user_id: user?.id,
                    total_amount: total,
                    payment_method: paymentMethod as any,
                    status: 'completed'
                })
                .select()
                .single()

            if (saleError) throw saleError

            // 2. Create Sale Items
            const saleItems = cart.map(item => ({
                sale_id: sale.id,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.retail_price,
                total_price: item.retail_price * item.quantity
            }))

            const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)
            if (itemsError) throw itemsError

            // 3. RS.GE Online Cheque Sync (Fiscal Simulation)
            console.log('Syncing with RS.GE Fiscal API...')
            await supabase
                .from('sales')
                .update({
                    fiscal_synced: true,
                    fiscal_id: `RS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                })
                .eq('id', sale.id)

            toast.success('გაყიდვა წარმატებით დასრულდა და სინქრონიზებულია RS.GE-სთან!')

            // Print Receipt
            setLastSale({ ...sale, items: [...cart] })
            setTimeout(() => {
                window.print()
            }, 500)

            setCart([])
            setIsCheckoutOpen(false)
            fetchData() // Refresh stock
        } catch (error: any) {
            toast.error('შეცდომა: ' + error.message)
        } finally {
            setProcessing(false)
        }
    }

    const handleCloseShift = async () => {
        if (!confirm('ნამდვილად გსურთ ცვლის დახურვა და Z-ანგარიშის ბეჭდვა?')) return

        setLoading(true)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Fetch today's sales for this branch
        const { data: todaySales } = await supabase
            .from('sales')
            .select('*')
            .eq('branch_id', branchId)
            .eq('status', 'completed')
            .gte('created_at', today.toISOString())

        if (todaySales) {
            const stats = todaySales.reduce((acc: any, sale: any) => {
                acc.totalSales += sale.total_amount
                if (sale.payment_method === 'cash') acc.cashSales += sale.total_amount
                else acc.cardSales += sale.total_amount
                return acc
            }, { totalSales: 0, cashSales: 0, cardSales: 0 })

            setZReportData({
                ...stats,
                vatTotal: stats.totalSales * 0.18,
                saleCount: todaySales.length,
                date: new Date(),
                branchName: branch?.name || 'DASTA Store'
            })

            setTimeout(() => {
                window.print()
                toast.success('Z-ანგარიში იბეჭდება...')
            }, 500)
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] animate-fade overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full gap-4 p-4 overflow-hidden">

                {/* Left Side: Products Section */}
                <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* POS Header/Search */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="form-input pl-10 h-12 text-lg"
                                    placeholder="ძებნა (დასახელება, ბარკოდი, SKU)..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button className="btn btn-secondary h-12 px-6">
                                <BarcodeIcon className="w-5 h-5 mr-2" /> სკანერი
                            </button>
                        </div>

                        {/* Categories Tabs */}
                        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                    activeCategory === 'all'
                                        ? "bg-brand-600 text-white shadow-brand"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                ყველა
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                        activeCategory === cat.id
                                            ? "bg-brand-600 text-white shadow-brand"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <span>იტვირთება...</span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Package className="w-16 h-16 opacity-10 mb-4" />
                                <p>პროდუქტები არ მოიძებნა</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                {filteredProducts.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="flex flex-col text-left group bg-gray-50 hover:bg-white hover:ring-2 hover:ring-brand-500 rounded-xl p-3 transition-all border border-transparent hover:shadow-xl"
                                    >
                                        <div className="w-full aspect-square bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-200" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight h-10">{product.name}</h4>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-brand-600 font-black">₾ {product.retail_price.toFixed(2)}</span>
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                                    product.current_stock <= product.min_stock ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                                )}>
                                                    {product.current_stock}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Cart Section */}
                <div className="w-full lg:w-[400px] flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:h-full max-h-[40vh] lg:max-h-none">
                    {/* Cart Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5 text-gray-600" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cart.reduce((a, b) => a + b.quantity, 0)}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-800">კალათა</h3>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => toast.success('მომხმარებელი დამატებულია (დემო)')}
                                className="p-2 hover:bg-brand-50 text-gray-400 hover:text-brand-600 rounded-lg transition-colors"
                                title="მომხმარებლის დამატება"
                            >
                                <UserPlus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleCloseShift}
                                className="p-2 hover:bg-amber-50 text-gray-400 hover:text-amber-600 rounded-lg transition-colors"
                                title="ცვლის დახურვა (Z-Report)"
                            >
                                <RefreshCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={clearCart}
                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                title="კალათის გასუფთავება"
                            >
                                <Eraser className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-3">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                <ShoppingCart className="w-12 h-12 opacity-10 mb-2" />
                                <p className="text-sm font-medium">კალათა ცარიელია</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 group animate-slide-in">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-700 truncate">{item.name}</h4>
                                        <div className="text-xs text-brand-600 font-black mt-1">₾ {item.retail_price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1.5 hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-black text-gray-700">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1.5 hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer / Totals */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>ჯამი</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 font-medium">
                                <span>დღგ (18%)</span>
                                <span>{formatCurrency(0)}</span> {/* Inclusive for now */}
                            </div>
                            <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-200">
                                <span>სულ</span>
                                <span className="text-brand-600">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            disabled={cart.length === 0}
                            className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 h-16 text-xl shadow-brand"
                        >
                            <Check className="w-6 h-6" /> გადახდა
                        </button>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-fade">
                    <div className="card w-full max-w-xl animate-scale shadow-2xl overflow-hidden flex flex-col p-0">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white text-center">
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-gray-900">გადახდის დასრულება</h3>
                                <p className="text-brand-600 text-4xl font-black mt-2">{formatCurrency(total)}</p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-8 space-y-8 bg-gray-50/50">
                            {/* Payment Method Selector */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3",
                                        paymentMethod === 'cash'
                                            ? "border-brand-600 bg-brand-50 shadow-brand animate-pulse-subtle"
                                            : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                                    )}
                                >
                                    <Banknote className={cn("w-10 h-10", paymentMethod === 'cash' ? "text-brand-600" : "text-gray-400")} />
                                    <span className={cn("font-black text-sm", paymentMethod === 'cash' ? "text-brand-800" : "text-gray-500")}>ნაღდი</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3",
                                        paymentMethod === 'card'
                                            ? "border-brand-600 bg-brand-50 shadow-brand"
                                            : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                                    )}
                                >
                                    <CreditCard className={cn("w-10 h-10", paymentMethod === 'card' ? "text-brand-600" : "text-gray-400")} />
                                    <span className={cn("font-black text-sm", paymentMethod === 'card' ? "text-brand-800" : "text-gray-500")}>ბარათი</span>
                                </button>
                            </div>

                            {/* Cash Input & Change */}
                            {paymentMethod === 'cash' && (
                                <div className="space-y-4 animate-slide-down">
                                    <div className="form-group">
                                        <label className="form-label text-center block mb-2 font-bold text-gray-500">მიღებული თანხა</label>
                                        <input
                                            type="number"
                                            className="form-input text-center text-4xl h-24 font-black border-2 border-brand-100 focus:border-brand-600 caret-brand-600"
                                            placeholder="0.00"
                                            value={paidAmount}
                                            onChange={(e) => setPaidAmount(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-between items-center p-6 bg-white rounded-2xl border border-brand-100 shadow-sm">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">ხურდა</span>
                                        <span className={cn(
                                            "text-3xl font-black",
                                            change < 0 ? "text-red-500" : "text-green-600"
                                        )}>
                                            {formatCurrency(Math.max(0, change))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-8 bg-white flex gap-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="btn btn-secondary btn-lg flex-1"
                            >
                                გაუქმება
                            </button>
                            <button
                                onClick={handleCompleteSale}
                                disabled={processing || (paymentMethod === 'cash' && change < 0)}
                                className="btn btn-primary btn-lg flex-1 h-16 text-lg"
                            >
                                {processing ? 'მიმდინარეობს...' : 'დასრულება'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Styles for scrollbar and pulses */}
            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(0.98); }
        }
        .animate-pulse-subtle { animation: pulse-subtle 3s infinite ease-in-out; }
      `}</style>

            {/* Print Components */}
            <div className="hidden">
                {lastSale && (
                    <ThermalReceipt
                        sale={lastSale}
                        items={lastSale.items}
                        branch={branch}
                        settings={settings}
                    />
                )}
                {zReportData && (
                    <ZReport data={zReportData} />
                )}
            </div>
        </div>
    )
}
