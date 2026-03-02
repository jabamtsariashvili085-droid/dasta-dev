'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    PieChart,
    Download,
    Calendar,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Percent,
    Receipt
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn, formatCurrency } from '@/lib/utils'

export default function ReportsPage({ params }: { params: { branchId: string } }) {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        revenue: 0,
        cost: 0,
        profit: 0,
        margin: 0,
        salesCount: 0,
        vat: 0
    })

    const supabase = createClient()

    const fetchReports = useCallback(async () => {
        setLoading(true)

        // 1. Fetch Sales and calculate totals
        const { data: sales, error } = await supabase
            .from('sales')
            .select('*, sale_items(*, products(purchase_price))')
            .eq('branch_id', params.branchId)
            .eq('status', 'completed')

        if (error) {
            toast.error('მონაცემების ჩატვირთვა ვერ მოხერხდა')
        } else {
            let revenue = 0
            let cost = 0
            let salesCount = sales?.length || 0

            sales?.forEach(sale => {
                revenue += sale.total_amount
                sale.sale_items?.forEach((item: any) => {
                    cost += (item.products?.purchase_price || 0) * item.quantity
                })
            })

            const profit = revenue - cost
            const margin = revenue > 0 ? (profit / revenue) * 100 : 0
            const vat = revenue * 0.18 // 18% VAT

            setStats({
                revenue,
                cost,
                profit,
                margin,
                salesCount,
                vat
            })
        }
        setLoading(false)
    }, [supabase, params.branchId])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    return (
        <div className="animate-fade pb-10">
            <div className="page-header">
                <div>
                    <h2 className="page-title">ანგარიშგება და ბუღალტერია</h2>
                    <p className="page-subtitle">ბიზნესის ფინანსური ანალიზი და მოგება-ზარალი</p>
                </div>

                <button className="btn btn-secondary">
                    <Download className="w-4 h-4 mr-2" /> ექსპორტი (Excel)
                </button>
            </div>

            {/* Date Filter Bar */}
            <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit">
                {['დღეს', '7 დღე', 'ამ თვეში', 'კვარტალი', 'წელი'].map((period, idx) => (
                    <button
                        key={idx}
                        className={cn(
                            "px-6 py-2.5 text-xs font-bold rounded-xl transition-all",
                            idx === 2 ? "bg-brand-600 text-white shadow-brand" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {period}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card bg-brand-600 border-none shadow-brand relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-brand-100 text-xs font-bold uppercase tracking-widest mb-1">ჯამური გაყიდვები</p>
                        <h3 className="text-3xl font-black text-white">{formatCurrency(stats.revenue)}</h3>
                        <div className="flex items-center gap-1 text-brand-200 text-xs mt-4 font-bold">
                            <ArrowUpRight className="w-3 h-3" /> +12% წინა თვესთან
                        </div>
                    </div>
                    <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-500 opacity-20 group-hover:scale-110 transition-transform" />
                </div>

                <div className="card shadow-xl border-none relative overflow-hidden group">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">თვითღირებულება</p>
                    <h3 className="text-3xl font-black text-gray-800">{formatCurrency(stats.cost)}</h3>
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-4 font-bold">
                        <ArrowDownRight className="w-3 h-3" /> -5% ხარჯების კლება
                    </div>
                    <TrendingDown className="absolute -bottom-4 -right-4 w-32 h-32 text-red-500 opacity-5 group-hover:scale-110 transition-transform" />
                </div>

                <div className="card shadow-xl border-none relative overflow-hidden group border-b-4 border-b-green-500">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">წმინდა მოგება</p>
                    <h3 className="text-3xl font-black text-green-600">{formatCurrency(stats.profit)}</h3>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-black">MARGIN {stats.margin.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="card shadow-xl border-none relative overflow-hidden group">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">გაყიდული რაოდენობა</p>
                    <h3 className="text-3xl font-black text-gray-800">{stats.salesCount}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-4 font-bold">
                        <Receipt className="w-3 h-3" /> სულ ჩეკები
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales by Category Chart (Mockup) */}
                <div className="card lg:col-span-2 shadow-xl border-none">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-brand-600" /> გაყიდვების დინამიკა
                        </h4>
                        <select className="text-xs font-bold text-gray-400 bg-transparent border-none outline-none cursor-pointer">
                            <option>ყოველდღიური</option>
                            <option>ყოველკვირეული</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end gap-3 justify-between px-4">
                        {[45, 60, 40, 80, 55, 70, 95, 65, 50, 85, 90, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-brand-50 group-hover:bg-brand-500 transition-all rounded-t-lg w-full"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 10}₾
                                    </div>
                                </div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-400 uppercase">{i + 1} მარ</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tax/VAT Box */}
                <div className="space-y-6">
                    <div className="card bg-gray-900 border-none shadow-2xl relative group overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Percent className="w-5 h-5 text-brand-400" />
                                </div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-widest">საგადასახადო</h4>
                            </div>
                            <p className="text-gray-400 text-xs mb-1">გადასახდელი დღგ (18%)</p>
                            <h3 className="text-3xl font-black text-brand-400 mb-6">{formatCurrency(stats.vat)}</h3>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-colors">
                                დეტალური რეპორტი
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    </div>

                    <div className="card shadow-xl border-none">
                        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <PieChart className="w-4 h-4 text-brand-600" /> კატეგორიების წილი
                        </h4>
                        <div className="space-y-4">
                            {[
                                { name: 'ტკბილეული', val: '45%', color: 'bg-brand-500' },
                                { name: 'სასმელები', val: '30%', color: 'bg-amber-500' },
                                { name: 'საკვები', val: '15%', color: 'bg-green-500' },
                                { name: 'სხვა', val: '10%', color: 'bg-gray-300' }
                            ].map((c, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold uppercase">
                                        <span className="text-gray-500">{c.name}</span>
                                        <span className="text-gray-800">{c.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", c.color)} style={{ width: c.val }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
