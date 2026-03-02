'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error('ავტორიზაცია ვერ მოხერხდა: ' + error.message)
            setLoading(false)
        } else {
            toast.success('წარმატებული ავტორიზაცია')
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-surface-1 animate-fade">
            <div className="card modal-sm w-full">
                <div className="flex flex-col items-center mb-8">
                    <div className="sidebar-logo-mark mb-4">D</div>
                    <h2 className="text-2xl font-bold text-gray-900">DASTA</h2>
                    <p className="text-gray-500 text-sm mt-1">ბიზნესის მართვის პლატფორმა</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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

                    <div className="form-group">
                        <div className="flex items-center justify-between">
                            <label className="form-label">პაროლი</label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                            >
                                დაგავიწყდათ?
                            </Link>
                        </div>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full flex justify-center mt-6"
                        disabled={loading}
                    >
                        {loading ? 'მიმდინარეობს...' : (
                            <>
                                <LogIn className="icon mr-2" />
                                შესვლა
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-top border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        არ გაქვთ ანგარიში?{' '}
                        <Link href="/register" className="text-brand-600 font-bold hover:underline">
                            დარეგისტრირდით
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
