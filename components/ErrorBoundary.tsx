'use client'

import React from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, status: any) {
        console.error('DASTA Error Boundary:', error, status)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-fade">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                        <AlertTriangle className="w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2">უი, რაღაც შეფერხდა</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        აპლიკაციამ დააფიქსირა შეცდომა. შესაძლოა ეს გამოწვეულია ინტერნეტთან კავშირის ან სისტემური შეფერხების გამო.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary h-12 px-8 shadow-brand"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> განახლება
                        </button>

                        <Link
                            href="/"
                            className="btn btn-secondary h-12 px-8"
                        >
                            <Home className="w-4 h-4 mr-2" /> მთავარი
                        </Link>
                    </div>

                    <div className="mt-12 p-4 bg-gray-100 rounded-2xl border border-gray-200 w-full max-w-xl text-left font-mono text-[10px] text-gray-400 overflow-auto max-h-32">
                        DEBUG INFO: {this.state.error?.message}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
