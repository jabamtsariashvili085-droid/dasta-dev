'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
    Loader2,
    Barcode,
    Filter,
    Download,
    Upload,
    AlertTriangle,
    MoreVertical
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import ProductModal from '@/components/inventory/ProductModal'
import { cn } from '@/lib/utils'

export default function InventoryPage({ params }: { params: { branchId: string } }) {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [stockFilter, setStockFilter] = useState('all')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)

    const supabase = createClient()

    const fetchData = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Fetch Categories for filter & modal
        const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .order('name')
        setCategories(catData || [])

        // 2. Fetch Products
        let query = supabase
            .from('products')
            .select('*, categories(name)')
            .order('name')

        if (categoryFilter !== 'all') {
            query = query.eq('category_id', categoryFilter)
        }

        const { data, error } = await query

        if (error) {
            toast.error('პროდუქტების ჩატვირთვა ვერ მოხერხდა')
        } else {
            let filtered = data || []

            // Filter by stock status
            if (stockFilter === 'low') {
                filtered = filtered.filter(p => p.current_stock <= p.min_stock && p.current_stock > 0)
            } else if (stockFilter === 'out') {
                filtered = filtered.filter(p => p.current_stock <= 0)
            }

            setProducts(filtered)
        }
        setLoading(false)
    }, [supabase, categoryFilter, stockFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleDelete = async (id: string) => {
        if (!confirm('ნამდვილად გსურთ პროდუქტის წაშლა?')) return

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('წაშლა ვერ მოხერხდა')
        } else {
            toast.success('პროდუქტი წაიშალა')
            fetchData()
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
        (p.barcode && p.barcode.includes(search))
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">პროდუქტები</h2>
                    <p className="page-subtitle">ინვენტარის მართვა და მარაგების კონტროლი</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-secondary">
                        <Upload className="w-4 h-4 mr-2" /> იმპორტი
                    </button>
                    <button className="btn btn-secondary">
                        <Download className="w-4 h-4 mr-2" /> ექსპორტი
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null)
                            setIsModalOpen(true)
                        }}
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4 mr-2" /> ახალი პროდუქტი
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative col-span-1 md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="ძებნა (დასახელება, SKU, ბარკოდი)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="form-input form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">ყველა კატეგორია</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="form-input form-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="all">ყველა მარაგი</option>
                    <option value="low">დაბალი მარაგი</option>
                    <option value="out">ამოწურული</option>
                </select>
            </div>

            {/* Table Section */}
            <div className="card no-padding overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span>იტვირთება...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-gray-25/50">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-gray-500">პროდუქტები არ არის</p>
                        <p className="text-xs">დაამატეთ ახალი პროდუქტი ინვენტარში</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>პროდუქტი</th>
                                    <th>SKU / ბარკოდი</th>
                                    <th>კატეგორია</th>
                                    <th>ფასი (საცალო)</th>
                                    <th>მარაგი</th>
                                    <th>სტატუსი</th>
                                    <th className="text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-25/50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? (
                                                    <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 leading-tight">{p.name}</p>
                                                    {p.unit && <span className="text-[10px] text-gray-400 uppercase font-medium">{p.unit}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="space-y-1">
                                                {p.sku && <div className="text-xs font-mono text-gray-500">SKU: {p.sku}</div>}
                                                {p.barcode && (
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                        <Barcode className="w-3 h-3" /> {p.barcode}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-secondary">{p.categories?.name || 'სხვა'}</span>
                                        </td>
                                        <td className="font-bold text-gray-700">
                                            ₾ {p.retail_price?.toFixed(2)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-bold",
                                                    p.current_stock <= p.min_stock ? "text-danger" : "text-gray-700"
                                                )}>
                                                    {p.current_stock}
                                                </span>
                                                {p.current_stock <= p.min_stock && (
                                                    <AlertTriangle className="w-3 h-3 text-danger" />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {p.current_stock <= 0 ? (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded">ამოწურულია</span>
                                            ) : p.current_stock <= p.min_stock ? (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-1 rounded">დაბალი მარაგი</span>
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-50 px-2 py-1 rounded">მარაგშია</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(p)
                                                        setIsModalOpen(true)
                                                    }}
                                                    className="btn-icon hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="btn-icon hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                categories={categories}
                onSuccess={fetchData}
            />
        </div>
    )
}
