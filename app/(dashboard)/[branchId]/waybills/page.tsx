'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Plus,
    Search,
    Truck,
    FileUp,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Filter,
    Users
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

export default function WaybillsPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params)
    const [waybills, setWaybills] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const supabase = createClient()

    const fetchWaybills = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('rs_documents')
            .select('*')
            .eq('branch_id', branchId)
            .eq('doc_type', 'waybill')
            .order('created_at', { ascending: false })

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        const { data, error } = await query
        if (error) {
            toast.error('ზედნადებების ჩატვირთვა ვერ მოხერხდა')
        } else {
            setWaybills(data || [])
        }
        setLoading(false)
    }, [supabase, branchId, statusFilter])

    useEffect(() => {
        fetchWaybills()
    }, [fetchWaybills])

    const filteredWaybills = waybills.filter(w =>
        (w.rs_id && w.rs_id.toString().includes(search)) ||
        (w.receiver_name && w.receiver_name.toLowerCase().includes(search.toLowerCase())) ||
        (w.receiver_tin && w.receiver_tin.includes(search))
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">ზედნადებები (RS.GE)</h2>
                    <p className="page-subtitle">ელექტრონული ზედნადებების მართვა და სინქრონიზაცია</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-secondary">
                        <Clock className="w-4 h-4 mr-2" /> ისტორია
                    </button>
                    <button className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> ახალი ზედნადები
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="ძებნა RS ID-ით, მყიდველით, საიდენტიფიკაციოთი..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="form-input form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">ყველა სტატუსი</option>
                    <option value="draft">დრაფტი</option>
                    <option value="sent">გაგზავნილი</option>
                    <option value="confirmed">დადასტურებული</option>
                    <option value="deleted">წაშლილი</option>
                </select>

                <button className="btn btn-secondary">
                    <FileUp className="w-4 h-4 mr-2" /> RS.GE-დან ჩატვირთვა
                </button>
            </div>

            {/* Table */}
            <div className="card no-padding overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span>იტვირთება...</span>
                    </div>
                ) : filteredWaybills.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-gray-400 bg-gray-25/50">
                        <Truck className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium text-gray-500">ზედნადებები არ არის</p>
                        <p className="text-xs">დაამატეთ ახალი ზედნადები ან ჩატვირთეთ RS.GE-დან</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>RS ID / ნომერი</th>
                                    <th>მყიდველი</th>
                                    <th>ტიპი</th>
                                    <th>თარიღი</th>
                                    <th>ჯამი</th>
                                    <th>სტატუსი</th>
                                    <th className="text-right">მოქმედება</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWaybills.map((w) => (
                                    <tr key={w.id} className="hover:bg-gray-25/50">
                                        <td className="font-bold text-gray-700">
                                            {w.rs_id || <span className="text-gray-300 italic">დრაფტი</span>}
                                        </td>
                                        <td>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{w.receiver_name}</p>
                                                <p className="text-[10px] text-gray-400">{w.receiver_tin}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-[10px] uppercase font-bold text-gray-500">
                                                {w.waybill_type === 'transport' ? 'ტრანსპორტირებით' : 'ტრანსპ. გარეშე'}
                                            </span>
                                        </td>
                                        <td className="text-xs text-gray-500">{formatDate(w.created_at)}</td>
                                        <td className="font-black text-gray-800">{formatCurrency(w.total_amount)}</td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                {w.status === 'confirmed' ? (
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                ) : w.status === 'sent' ? (
                                                    <Clock className="w-3 h-3 text-blue-500" />
                                                ) : (
                                                    <AlertCircle className="w-3 h-3 text-gray-400" />
                                                )}
                                                <span className={cn(
                                                    "badge text-[10px]",
                                                    w.status === 'confirmed' ? "badge-primary" :
                                                        w.status === 'sent' ? "bg-blue-50 text-blue-600" :
                                                            w.status === 'deleted' ? "bg-red-50 text-red-600" : "badge-secondary"
                                                )}>
                                                    {w.status === 'confirmed' ? 'დადასტურებული' :
                                                        w.status === 'sent' ? 'გაგზავნილი' :
                                                            w.status === 'deleted' ? 'წაშლილი' : 'დრაფტი'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="btn-icon">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {w.status === 'draft' && (
                                                    <button className="btn-icon text-brand-600 hover:bg-brand-50">
                                                        <FileUp className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
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
