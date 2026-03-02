'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Search,
    History,
    FileText,
    Eye,
    RotateCcw,
    Calendar,
    Filter,
    CreditCard,
    Banknote,
    MoreVertical,
    Loader2,
    X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export default function SalesHistoryPage({ params }: { params: { branchId: string } }) {
    const [sales, setSales] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [paymentFilter, setPaymentFilter] = useState('all')

    // Detail View State
    const [selectedSale, setSelectedSale] = useState<any>(null)
    const [saleItems, setSaleItems] = useState<any[]>([])
    const [loadingItems, setLoadingItems] = useState(false)
    const [processingReturn, setProcessingReturn] = useState(false)

    const supabase = createClient()

    const fetchSales = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('sales')
            .select('*, branch_users(user_id)')
            .eq('branch_id', params.branchId)
            .order('created_at', { ascending: false })

        if (paymentFilter !== 'all') {
            query = query.eq('payment_method', paymentFilter)
        }

        const { data, error } = await query

        if (error) {
            toast.error('გაყიდვების ისტორიის ჩატვირთვა ვერ მოხერხდა')
        } else {
            setSales(data || [])
        }
        setLoading(false)
    }, [supabase, params.branchId, paymentFilter])

    useEffect(() => {
        fetchSales()
    }, [fetchSales])

    const fetchSaleDetails = async (sale: any) => {
        setSelectedSale(sale)
        setLoadingItems(true)

        const { data, error } = await supabase
            .from('sale_items')
            .select('*, products(name, sku)')
            .eq('sale_id', sale.id)

        if (error) {
            toast.error('დეტალების ჩატვირთვა ვერ მოხერხდა')
        } else {
            setSaleItems(data || [])
        }
        setLoadingItems(false)
    }

    const handleReturn = async (id: string) => {
        if (!confirm('ნამდვილად გსურთ ამ გაყიდვის გაუქმება/დაბრუნება?')) return
        setProcessingReturn(true)

        try {
            const { error } = await supabase
                .from('sales')
                .update({ status: 'refunded' })
                .eq('id', id)

            if (error) throw error

            toast.success('გაყიდვა გაუქმებულია/დაბრუნებულია')
            setSelectedSale(null)
            fetchSales()
        } catch (error: any) {
            toast.error('შეცდომა: ' + error.message)
        } finally {
            setProcessingReturn(false)
        }
    }

    const filteredSales = sales.filter(s =>
        s.id.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">გაყიდვების ისტორია</h2>
                    <p className="page-subtitle">ტრანზაქციების რეესტრი და დაბრუნებები</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="ძებნა ID-ით..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
                    <button
                        onClick={() => setPaymentFilter('all')}
                        className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            paymentFilter === 'all' ? "bg-brand-50 text-brand-600" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        ყველა
                    </button>
                    <button
                        onClick={() => setPaymentFilter('cash')}
                        className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            paymentFilter === 'cash' ? "bg-brand-50 text-brand-600" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        ნაღდი
                    </button>
                    <button
                        onClick={() => setPaymentFilter('card')}
                        className={cn(
                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                            paymentFilter === 'card' ? "bg-brand-50 text-brand-600" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        ბარათი
                    </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-xs font-bold text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>დღევანდელი ტრანზაქციები</span>
                </div>
            </div>

            {/* Table */}
            <div className="card no-padding">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span>იტვირთება...</span>
                    </div>
                ) : filteredSales.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <History className="w-12 h-12 mb-4 opacity-10" />
                        <p>გაყიდვები არ მოიძებნა</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>გაყიდვის ID</th>
                                    <th>თარიღი</th>
                                    <th>გადახდა</th>
                                    <th>ჯამი</th>
                                    <th>სტატუსი</th>
                                    <th className="text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-gray-25/50 transition-colors">
                                        <td className="font-mono text-[10px] text-gray-400">#{sale.id.split('-')[0].toUpperCase()}</td>
                                        <td className="text-xs font-bold text-gray-600">{formatDate(sale.created_at)}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {sale.payment_method === 'cash' ? (
                                                    <Banknote className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                                )}
                                                <span className="text-xs font-medium text-gray-500">
                                                    {sale.payment_method === 'cash' ? 'ნაღდი' : 'ბარათი'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="font-black text-gray-800">{formatCurrency(sale.total_amount)}</td>
                                        <td>
                                            <span className={cn(
                                                "badge",
                                                sale.status === 'completed' ? "badge-primary" : "badge-secondary bg-red-50 text-red-500"
                                            )}>
                                                {sale.status === 'completed' ? 'დასრულებული' : 'დაბრუნებული'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => fetchSaleDetails(sale)}
                                                className="btn-icon"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sale Detail Modal */}
            {selectedSale && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-fade">
                    <div className="card modal-md w-full animate-slide-up shadow-2xl relative p-0 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg">გაყიდვის დეტალები #{selectedSale.id.split('-')[0].toUpperCase()}</h3>
                            <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">თარიღი</p>
                                    <p className="text-sm font-bold text-gray-700">{formatDate(selectedSale.created_at)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">გადახდის მეთოდი</p>
                                    <p className="text-sm font-bold text-gray-700">
                                        {selectedSale.payment_method === 'cash' ? 'ნაღდი' : 'ბარათი'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">პროდუქცია</h4>
                                <div className="max-h-64 overflow-y-auto pr-2 no-scrollbar space-y-2">
                                    {loadingItems ? (
                                        <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-600" /></div>
                                    ) : (
                                        saleItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700">{item.products?.name}</p>
                                                    <p className="text-[10px] text-gray-400">Qty: {item.quantity} x {formatCurrency(item.unit_price)}</p>
                                                </div>
                                                <p className="text-sm font-black text-brand-600">{formatCurrency(item.total_price)}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-brand-50 rounded-2xl flex justify-between items-center border border-brand-100">
                                <span className="font-bold text-brand-800">სულ ჯამი:</span>
                                <span className="text-2xl font-black text-brand-600">{formatCurrency(selectedSale.total_amount)}</span>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="btn btn-secondary flex-1"
                            >
                                დახურვა
                            </button>
                            {selectedSale.status === 'completed' && (
                                <button
                                    onClick={() => handleReturn(selectedSale.id)}
                                    disabled={processingReturn}
                                    className="btn bg-red-500 hover:bg-red-600 text-white flex-1 flex items-center justify-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    დაბრუნება / გაუქმება
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
