'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Building2,
    MapPin,
    Phone,
    Settings,
    Save,
    Loader2,
    Bell,
    Wallet
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function BranchSettingsPage({ params }: { params: { branchId: string } }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [branch, setBranch] = useState<any>(null)
    const [settings, setSettings] = useState<any>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: branchData } = await supabase
                .from('branches')
                .select('*, branch_settings(*)')
                .eq('id', params.branchId)
                .single()

            if (branchData) {
                setBranch(branchData)
                setSettings(branchData.branch_settings)
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase, params.branchId])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // 1. Update Branch Info
            const { error: bError } = await supabase
                .from('branches')
                .update({
                    name: branch.name,
                    address: branch.address,
                    phone: branch.phone
                })
                .eq('id', params.branchId)

            if (bError) throw bError

            // 2. Update Settings
            const { error: sError } = await supabase
                .from('branch_settings')
                .update({
                    vat_rate: Number(settings.vat_rate),
                    currency: settings.currency,
                    low_stock_threshold: Number(settings.low_stock_threshold),
                    receipt_header: settings.receipt_header,
                    receipt_footer: settings.receipt_footer
                })
                .eq('branch_id', params.branchId)

            if (sError) throw sError

            toast.success('პარამეტრები შენახულია')
        } catch (error: any) {
            toast.error('შეცდომა: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>

    return (
        <div className="max-w-4xl mx-auto animate-fade">
            <div className="page-header">
                <div>
                    <h2 className="page-title">ფილიალის პარამეტრები</h2>
                    <p className="page-subtitle">ლოკალური კონფიგურაცია და ინფორმაცია</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card shadow-xl border-none">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-brand-600" /> ძირითადი ინფორმაცია
                            </h3>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">ფილიალის დასახელება</label>
                                    <input
                                        type="text" className="form-input"
                                        value={branch?.name || ''}
                                        onChange={e => setBranch({ ...branch, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">მისამართი</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text" className="form-input pl-10"
                                                value={branch?.address || ''}
                                                onChange={e => setBranch({ ...branch, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">ტელეფონი</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text" className="form-input pl-10"
                                                value={branch?.phone || ''}
                                                onChange={e => setBranch({ ...branch, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-xl border-none">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-brand-600" /> ჩეკი და ფინანსები
                            </h3>
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">ჩეკის თავსართი</label>
                                    <textarea
                                        className="form-input h-20"
                                        value={settings?.receipt_header || ''}
                                        onChange={e => setSettings({ ...settings, receipt_header: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ჩეკის ბოლოსართი</label>
                                    <input
                                        type="text" className="form-input"
                                        value={settings?.receipt_footer || ''}
                                        onChange={e => setSettings({ ...settings, receipt_footer: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">დღგ-ს განაკვეთი (%)</label>
                                        <input
                                            type="number" className="form-input"
                                            value={settings?.vat_rate || 18}
                                            onChange={e => setSettings({ ...settings, vat_rate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">ვალუტა</label>
                                        <select
                                            className="form-input form-select"
                                            value={settings?.currency || 'GEL'}
                                            onChange={e => setSettings({ ...settings, currency: e.target.value })}
                                        >
                                            <option value="GEL">GEL (₾)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="card shadow-xl border-none bg-gray-900 text-white">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-brand-400" /> შეტყობინებები
                            </h3>
                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="form-label !text-gray-400">მარაგის კრიტიკული ზღვარი</label>
                                    <input
                                        type="number" className="form-input !bg-white/5 !border-white/10 !text-white"
                                        value={settings?.low_stock_threshold || 5}
                                        onChange={e => setSettings({ ...settings, low_stock_threshold: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2">გაფრთხილება მარაგის ამოწურვაზე.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full h-16 shadow-brand"
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Save className="w-5 h-5 mr-2" /> პარამეტრების შენახვა
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
