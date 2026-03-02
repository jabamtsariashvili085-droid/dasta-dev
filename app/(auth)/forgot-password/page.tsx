'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback`,
        })

        if (error) {
            toast.error('შეცდომა: ' + error.message)
            setLoading(false)
        } else {
            setSent(true)
            toast.success('აღდგენის ბმული გამოგზავნილია')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-surface-1 animate-fade">
            <div className="card modal-sm w-full">
                <div className="flex flex-col items-center mb-8">
                    <div className="sidebar-logo-mark mb-4 bg-amber-500">!</div>
                    <h2 className="text-2xl font-bold text-gray-900">პაროლის აღდგენა</h2>
                    <p className="text-gray-500 text-sm mt-1 text-center">
                        მიუთითეთ თქვენი ელ-ფოსტა აღდგენის ბმულის მისაღებად
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">ელ-ფოსტა</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full flex justify-center mt-6"
                            disabled={loading}
                        >
                            {loading ? 'მიმდინარეობს...' : 'გამოგზავნა'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-4 bg-brand-50 rounded-lg border border-brand-100">
                        <Mail className="w-12 h-12 text-brand-600 mx-auto mb-3" />
                        <p className="text-brand-800 font-medium">
                            ბმული წარმატებით გამოიგზავნა თქვენს ელ-ფოსტაზე.
                        </p>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        დაბრუნება ავტორიზაციაზე
                    </Link>
                </div>
            </div>
        </div>
    )
}
