'use client'

import { Search, Bell, User, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Topbar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="topbar">
            {/* Search Bar */}
            <div className="topbar-search">
                <Search className="w-4 h-4 text-gray-400" />
                <span>ძებნა...</span>
                <kbd>⌘K</kbd>
            </div>

            {/* Actions */}
            <div className="topbar-actions">
                <button className="topbar-btn">
                    <Moon className="w-5 h-5" />
                </button>

                <button className="topbar-btn">
                    <Bell className="w-5 h-5" />
                    <span className="notif-dot" />
                </button>

                <div className="h-8 w-[1px] bg-gray-200 mx-2" />

                <button className="topbar-btn group relative">
                    <User className="w-5 h-5" />

                    {/* Simple Dropdown Overlay */}
                    <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50">
                        <div className="card-sm w-48 shadow-lg border border-gray-100 p-1">
                            <button className="sidebar-item !text-gray-700 hover:!bg-gray-50">
                                <Settings className="w-4 h-4 mr-2" /> პროფილი
                            </button>
                            <button
                                onClick={handleLogout}
                                className="sidebar-item !text-danger hover:!bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> გასვლა
                            </button>
                        </div>
                    </div>
                </button>
            </div>
        </header>
    )
}
