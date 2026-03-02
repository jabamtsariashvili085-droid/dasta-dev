'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { User, Building2, MapPin, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        tin: '',
        phone: '',
        branchName: 'მთავარი ფილიალი',
        branchAddress: ''
    })

    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
                toast.error('შეავსეთ ყველა ველი სწორად')
                return
            }
        }
        if (step === 2) {
            if (!formData.companyName) {
                toast.error('მიუთითეთ კომპანიის სახელი')
                return
            }
        }
        setStep(step + 1)
    }

    const prevStep = () => setStep(step - 1)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Sign Up User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('ვერ მოხერხდა რეგისტრაცია')

            const userId = authData.user.id

            // 2. Create Company
            const slug = formData.companyName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'company-' + Date.now()
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .insert({
                    name: formData.companyName,
                    slug,
                    tin: formData.tin,
                    phone: formData.phone
                })
                .select()
                .single()

            if (companyError) throw companyError

            // 3. Create Branch
            const { data: branch, error: branchError } = await supabase
                .from('branches')
                .insert({
                    company_id: company.id,
                    name: formData.branchName,
                    address: formData.branchAddress,
                    is_main: true
                })
                .select()
                .single()

            if (branchError) throw branchError

            // 4. Create Branch Settings
            const { error: settingsError } = await supabase
                .from('branch_settings')
                .insert({ branch_id: branch.id })

            if (settingsError) throw settingsError

            // 5. Link User to Company (as owner/admin)
            const { error: companyUserError } = await supabase.from('company_users').insert({
                company_id: company.id,
                user_id: userId,
                role: 'admin'
            })
            if (companyUserError) throw new Error('კომპანიასთან დაკავშირება ვერ მოხერხდა: ' + companyUserError.message)

            // 6. Link User to Branch
            const { error: branchUserError } = await supabase.from('branch_users').insert({
                branch_id: branch.id,
                user_id: userId,
                role: 'manager'
            })
            if (branchUserError) throw new Error('ფილიალთან დაკავშირება ვერ მოხერხდა: ' + branchUserError.message)

            toast.success('რეგისტრაცია წარმატებით დასრულდა!')
            router.push('/onboarding')

        } catch (error: any) {
            toast.error('რეგისტრაციისას დაფიქსირდა შეცდომა: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-surface-1 animate-fade">
            <div className="card modal-md w-full">
                {/* Progress Header */}
                <div className="flex justify-between items-center mb-8 px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                ${step === s ? 'bg-brand-600 text-white scale-110 shadow-brand' :
                                    step > s ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'}`}>
                                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block
                ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s === 1 ? 'ანგარიში' : s === 2 ? 'კომპანია' : 'ფილიალი'}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleRegister}>
                    {/* STEP 1: Account Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-slide">
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-6 h-6 text-brand-600" />
                                <h3 className="text-lg font-bold">ანგარიშის შექმნა</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">სრული სახელი</label>
                                <input name="fullName" type="text" className="form-input" placeholder="გიორგი გიორგაძე" onChange={updateForm} value={formData.fullName} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">ელ-ფოსტა</label>
                                <input name="email" type="email" className="form-input" placeholder="name@company.com" onChange={updateForm} value={formData.email} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">პაროლი</label>
                                    <input name="password" type="password" className="form-input" placeholder="••••••••" onChange={updateForm} value={formData.password} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">გაიმეორეთ</label>
                                    <input name="confirmPassword" type="password" className="form-input" placeholder="••••••••" onChange={updateForm} value={formData.confirmPassword} required />
                                </div>
                            </div>
                            <button type="button" onClick={nextStep} className="btn btn-primary btn-lg w-full mt-6">გაგრძელება</button>
                        </div>
                    )}

                    {/* STEP 2: Company Info */}
                    {step === 2 && (
                        <div className="space-y-4 animate-slide">
                            <div className="flex items-center gap-3 mb-4">
                                <Building2 className="w-6 h-6 text-brand-600" />
                                <h3 className="text-lg font-bold">კომპანიის მონაცემები</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">კომპანიის დასახელება</label>
                                <input name="companyName" type="text" className="form-input" placeholder="შპს ჩემი ბიზნესი" onChange={updateForm} value={formData.companyName} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">საიდენტიფიკაციო კოდი</label>
                                    <input name="tin" type="text" className="form-input" placeholder="405123456" onChange={updateForm} value={formData.tin} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ტელეფონი</label>
                                    <input name="phone" type="tel" className="form-input" placeholder="599 00 00 00" onChange={updateForm} value={formData.phone} />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={prevStep} className="btn btn-secondary btn-lg flex-1">უკან</button>
                                <button type="button" onClick={nextStep} className="btn btn-primary btn-lg flex-1">გაგრძელება</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Branch Info */}
                    {step === 3 && (
                        <div className="space-y-4 animate-slide">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-6 h-6 text-brand-600" />
                                <h3 className="text-lg font-bold">ფილიალის დამატება</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">ფილიალის დასახელება</label>
                                <input name="branchName" type="text" className="form-input" placeholder="მთავარი ფილიალი" onChange={updateForm} value={formData.branchName} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">მისამართი</label>
                                <input name="branchAddress" type="text" className="form-input" placeholder="თბილისი, რუსთაველის გამზ. 1" onChange={updateForm} value={formData.branchAddress} required />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={prevStep} className="btn btn-secondary btn-lg flex-1">უკან</button>
                                <button type="submit" className="btn btn-primary btn-lg flex-1" disabled={loading}>
                                    {loading ? 'მიმდინარეობს რეგისტრაცია...' : 'რეგისტრაციის დასრულება'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-8 pt-6 border-top border-gray-100 text-center text-sm text-gray-400">
                    უკვე გაქვთ ანგარიში?{' '}
                    <Link href="/login" className="text-brand-600 font-bold hover:underline">შესვლა</Link>
                </div>
            </div>
        </div>
    )
}
