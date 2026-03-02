'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Plus,
    Search,
    FileText,
    FileUp,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RefreshCcw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export default function InvoicesPage({ params }: { params: { branchId: string } }) {
    const [invoices, setInvoices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const supabase = createClient()

    const fetchInvoices = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('rs_documents')
            .select('*')
            .eq('branch_id', params.branchId)
            .eq('doc_type', 'invoice')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error('ფაქტურების ჩატვირთვა ვერ მოხერხდა')
        } else {
            setInvoices(data || [])
        }
        setLoading(false)
    }, [supabase, params.branchId])

    useEffect(() => {
        fetchInvoices()
    }, [fetchInvoices])

    const filteredInvoices = invoices.filter(i =>
        (i.rs_id && i.rs_id.toString().includes(search)) ||
        (i.receiver_name && i.receiver_name.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">ფაქტურები (Invoices)</h2>
                    <p className="page-subtitle">საგადასახადო ანგარიშ-ფაქტურების რეესტრი</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> ახალი ფაქტურა
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="ძებნა ID-ით ან მყიდველით..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button className="btn btn-secondary">
                    <RefreshCcw className="w-4 h-4 mr-2" /> სინქრონიზაცია RS.GE-თან
                </button>
            </div>

            {/* Table */}
            <div className="card no-padding overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span>იტვირთება...</span>
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-gray-25/50">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-gray-500">ფაქტურები არ არის</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>სერია / ნომერი</th>
                                    <th>მყიდველი</th>
                                    <th>თარიღი</th>
                                    <th>ჯამი</th>
                                    <th>დღგ (18%)</th>
                                    <th>სტატუსი</th>
                                    <th className="text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((i) => (
                                    <tr key={i.id} className="hover:bg-gray-25/50">
                                        <td className="font-bold text-gray-700">{i.rs_id || 'დრაფტი'}</td>
                                        <td>
                                            <p className="text-xs font-bold">{i.receiver_name}</p>
                                            <p className="text-[10px] text-gray-400">{i.receiver_tin}</p>
                                        </td>
                                        <td className="text-xs text-gray-500">{formatDate(i.created_at)}</td>
                                        <td className="font-black text-gray-800">{formatCurrency(i.total_amount)}</td>
                                        <td className="text-xs text-brand-600 font-bold">{formatCurrency(i.total_amount * 0.18)}</td>
                                        <td>
                                            <span className={cn(
                                                "badge text-[10px]",
                                                i.status === 'confirmed' ? "badge-primary" : "badge-secondary"
                                            )}>
                                                {i.status === 'confirmed' ? 'დადასტურებული' : 'დრაფტი'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn-icon">
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
        </div>
    )
}
