'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Users,
    UserPlus,
    Shield,
    Mail,
    MoreVertical,
    Trash2,
    CheckCircle2,
    Loader2,
    Smartphone
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function BranchUsersPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('branch_users')
            .select('*, users(*)')
            .eq('branch_id', branchId)

        if (error) {
            toast.error('მომხმარებლების ჩატვირთვა ვერ მოხერხდა')
        } else {
            setUsers(data || [])
        }
        setLoading(false)
    }, [supabase, branchId])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">თანამშრომლები</h2>
                    <p className="page-subtitle">ფილიალის წვდომის მართვა და როლები</p>
                </div>

                <button className="btn btn-primary">
                    <UserPlus className="w-4 h-4 mr-2" /> თანამშრომლის დამატება
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
                ) : users.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                        <Users className="w-12 h-12 mb-4 opacity-10" />
                        <p>თანამშრომლები არ არის</p>
                    </div>
                ) : (
                    users.map((item) => (
                        <div key={item.id} className="card shadow-xl border-none hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-xl">
                                        {item.users?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 leading-tight">{item.users?.full_name}</h4>
                                        <span className={cn(
                                            "badge text-[10px] mt-1",
                                            item.role === 'admin' ? "badge-primary" : "badge-secondary"
                                        )}>
                                            {item.role === 'admin' ? 'ადმინისტრატორი' : 'მოლარე'}
                                        </span>
                                    </div>
                                </div>
                                <button className="btn-icon">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-3 relative z-10">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail className="w-3.5 h-3.5" />
                                    {item.users?.email}
                                </div>
                                {item.users?.phone && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Smartphone className="w-3.5 h-3.5" />
                                        {item.users.phone}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase">
                                    <CheckCircle2 className="w-3 h-3" /> აქტიური
                                </div>
                                <button className="text-[10px] text-red-500 font-bold hover:underline">
                                    წვდომის გაუქმება
                                </button>
                            </div>

                            <Shield className="absolute -bottom-6 -right-6 w-24 h-24 text-gray-100 opacity-20 group-hover:scale-110 transition-transform" />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
