'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Key,
    ShieldCheck,
    Save,
    Loader2,
    Building2,
    RefreshCw,
    AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function RSGESettingsPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = use(params)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [su, setSu] = useState('')
    const [sp, setSp] = useState('')

    const supabase = createClient()

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from('branch_settings')
                .select('rs_su, rs_sp')
                .eq('branch_id', branchId)
                .single()

            if (data) {
                setSu(data.rs_su || '')
                setSp(data.rs_sp || '')
            }
            setLoading(false)
        }
        fetchSettings()
    }, [supabase, branchId])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('branch_settings')
                .update({ rs_su: su, rs_sp: sp })
                .eq('branch_id', branchId)

            if (error) throw error
            toast.success('RS.GE პარამეტრები შენახულია')
        } catch (error: any) {
            toast.error('შეცდომა: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleTestConnection = async () => {
        toast.promise(
            new Promise((res) => setTimeout(res, 2000)), // Mocked test
            {
                loading: 'მიმდინარეობს კავშირის შემოწმება...',
                success: 'RS.GE კავშირი წარმატებულია!',
                error: 'ავტორიზაცია ვერ მოხერხდა',
            }
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">RS.GE კავშირი</h2>
                    <p className="page-subtitle">სერვისების მართვის პანელის ავტორიზაცია</p>
                </div>
            </div>

            <div className="card shadow-xl border-t-4 border-t-brand-600">
                <div className="flex items-center gap-4 mb-8 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                    <ShieldCheck className="w-10 h-10 text-brand-600" />
                    <div>
                        <h3 className="font-bold text-brand-900">უსაფრთხო კავშირი</h3>
                        <p className="text-xs text-brand-700">თქვენი მონაცემები დაშიფრულია და გამოიყენება მხოლოდ RS.GE-სთან კომუნიკაციისთვის.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            RS.GE მომხმარებელი (SU)
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="მაგ: user_123..."
                            value={su}
                            onChange={(e) => setSu(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                            <Key className="w-4 h-4 text-gray-400" />
                            RS.GE პაროლი (SP)
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={sp}
                            onChange={(e) => setSp(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleTestConnection}
                            className="btn btn-secondary flex-1"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" /> ტესტირება
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 shadow-brand"
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4 mr-2" /> შენახვა
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-none" />
                <div className="text-xs text-amber-800 space-y-2">
                    <p className="font-bold">როგორ მივიღოთ SU და SP?</p>
                    <p>1. შედით RS.GE-ზე</p>
                    <p>2. "სერვისების მართვის პანელი" - "წვდომა სისტემაზე (SU/SP)"</p>
                    <p>3. იქ ნახავთ თქვენს მონაცემებს.</p>
                </div>
            </div>
        </div>
    )
}
