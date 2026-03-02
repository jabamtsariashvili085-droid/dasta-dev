'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
    CheckCircle2,
    Settings2,
    Globe,
    Wallet,
    ArrowRight,
    Loader2
} from 'lucide-react'

export default function OnboardingPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [branch, setBranch] = useState<any>(null)
    const [settings, setSettings] = useState({
        vat_rate: 18,
        currency: 'GEL',
        receipt_header: '',
        receipt_footer: 'გმადლობთ, რომ სარგებლობთ ჩვენი მომსახურებით!',
        low_stock_threshold: 5
    })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchOnboardingData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                // 1. Find the branch this user is linked to
                const { data: userBranch } = await supabase
                    .from('branch_users')
                    .select('branch_id')
                    .eq('user_id', user.id)
                    .limit(1)
                    .maybeSingle()

                if (!userBranch) {
                    console.error('No branch user link found')
                    toast.error('თქვენი ანგარიში არ არის დაკავშირებული ფილიალთან.')
                    return
                }

                // 2. Fetch branch and settings separately for maximum reliability
                const { data: branchData, error: branchError } = await supabase
                    .from('branches')
                    .select('*, branch_settings(*)')
                    .eq('id', userBranch.branch_id)
                    .single()

                if (branchError || !branchData) {
                    console.error('Onboarding Fetch Error:', branchError)
                    toast.error('ფილიალის მონაცემები ვერ ჩაიტვირთა')
                    return
                }

                setBranch(branchData)
                const branchSettings = Array.isArray(branchData.branch_settings)
                    ? branchData.branch_settings[0]
                    : branchData.branch_settings

                if (branchSettings) {
                    setSettings({
                        vat_rate: branchSettings.vat_rate || 18,
                        currency: branchSettings.currency || 'GEL',
                        receipt_header: branchSettings.receipt_header || branchData.name,
                        receipt_footer: branchSettings.receipt_footer || 'გმადლობთ, რომ სარგებლობთ ჩვენი მომსახურებით!',
                        low_stock_threshold: branchSettings.low_stock_threshold || 5
                    })
                }
            } catch (err: any) {
                console.error('Onboarding Catch Error:', err)
                toast.error('დაფიქსირდა მოულოდნელი შეცდომა')
            } finally {
                setLoading(false)
            }
        }

        fetchOnboardingData()
    }, [supabase, router])

    const handleComplete = async () => {
        if (!branch?.id) {
            toast.error('ფილიალის იდენტიფიკატორი ვერ მოიძებნა')
            return
        }

        setSaving(true)
        try {
            const { error } = await supabase
                .from('branch_settings')
                .update({
                    ...settings,
                    onboarding_done: true,
                    updated_at: new Date().toISOString()
                })
                .eq('branch_id', branch.id)

            if (error) {
                console.error('Update Settings Error:', error)
                throw error
            }

            toast.success('კონფიგურაცია წარმატებით დასრულდა!')

            // USE HARD REDIRECT to bypass any client-side routing issues
            setTimeout(() => {
                window.location.href = `/${branch.id}`
            }, 800)

        } catch (error: any) {
            console.error('Onboarding Complete Error:', error)
            toast.error('შენახვისას დაფიქსირდა შეცდომა: ' + (error.message || 'უცნობი შეცდომა'))
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-surface-1 animate-fade">
            <div className="card modal-md w-full">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">გილოცავთ!</h2>
                    <p className="text-gray-500 text-center mt-2 max-w-sm">
                        თქვენი ანგარიში მზად არის. მოდით სწრაფად მოვარგოთ სისტემა თქვენს საჭიროებებს.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Section: Basic Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Globe className="w-4 h-4 text-brand-600" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700">ძირითადი პარამეტრები</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">ვალუტა</label>
                                <select
                                    className="form-input form-select"
                                    value={settings.currency}
                                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                >
                                    <option value="GEL">GEL (₾)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">დღგ-ს განაკვეთი (%)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={settings.vat_rate}
                                    onChange={(e) => setSettings({ ...settings, vat_rate: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Receipt Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Wallet className="w-4 h-4 text-brand-600" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700">ჩეკის პარამეტრები</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">ჩეკის თავსართი (სახელი/მისამართი)</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="მაღაზიის სახელი..."
                                value={settings.receipt_header}
                                onChange={(e) => setSettings({ ...settings, receipt_header: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ჩეკის ბოლოსართი (მადლობა/სლოგანი)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.receipt_footer}
                                onChange={(e) => setSettings({ ...settings, receipt_footer: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Section: Inventory Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Settings2 className="w-4 h-4 text-brand-600" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-700">ინვენტარი</h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">მარაგის კრიტიკული ზღვარი (რაოდენობა)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={settings.low_stock_threshold}
                                onChange={(e) => setSettings({ ...settings, low_stock_threshold: Number(e.target.value) })}
                            />
                            <p className="text-[10px] text-gray-400">ამ რაოდენობაზე ნაკლების შემთხვევაში სისტემა გამოგიგზავნით გაფრთხილებას.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleComplete}
                        className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 mt-4 py-4 text-lg"
                        disabled={saving}
                    >
                        {saving ? 'მიმდინარეობს შენახვა...' : (
                            <>
                                სამუშაო დაფაზე გადასვლა
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {/* Fallback link if automatic redirection fails */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            პრობლემაა გადასვლისას?
                            <a href={`/${branch.id}`} className="text-brand-600 font-medium hover:underline ml-1">
                                პირდაპირ სამუშაო დაფაზე გადასვლა
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
