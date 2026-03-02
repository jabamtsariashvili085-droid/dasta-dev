'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Monitor,
    Package,
    Tags,
    ShoppingCart,
    RefreshCcw,
    Settings2,
    AlertCircle,
    FileText,
    Users,
    Wallet,
    Calculator,
    BarChart3,
    Truck,
    ClipboardList,
    Building2,
    History,
    Settings,
    ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    branchId: string
}

const navGroups = [
    {
        label: 'მთავარი',
        items: [
            { label: 'დაფა', icon: LayoutDashboard, href: '' },
            { label: 'საკასო (POS)', icon: Monitor, href: '/pos' },
        ]
    },
    {
        label: 'ინვენტარი',
        items: [
            { label: 'პროდუქტები', icon: Package, href: '/inventory' },
            { label: 'კატეგორიები', icon: Tags, href: '/categories' },
            { label: 'შეძენები', icon: ShoppingCart, href: '/purchases' },
            { label: 'გადაცემები', icon: RefreshCcw, href: '/transfers' },
            { label: 'კორექციები', icon: Settings2, href: '/adjustments' },
            { label: 'მარაგის გაფრთხ.', icon: AlertCircle, href: '/alerts', badge: 0 },
        ]
    },
    {
        label: 'გაყიდვები',
        items: [
            { label: 'გაყიდვები', icon: FileText, href: '/sales' },
            { label: 'კლიენტები', icon: Users, href: '/customers' },
            { label: 'საკასო სმენი', icon: Wallet, href: '/cash-register' },
        ]
    },
    {
        label: 'ბუღალტერია',
        items: [
            { label: 'ბუღალტერია', icon: Calculator, href: '/accounting' },
            { label: 'ანგარიშები', icon: BarChart3, href: '/reports' },
        ]
    },
    {
        label: 'RS.GE',
        items: [
            { label: 'ზედნადებები', icon: Truck, href: '/waybills' },
            { label: 'ფაქტურები', icon: ClipboardList, href: '/invoices' },
            { label: 'RS.GE კავშირი', icon: RefreshCcw, href: '/rsge' },
        ]
    },
    {
        label: 'სისტემა',
        items: [
            { label: 'მიმწოდებლები', icon: Users, href: '/suppliers' },
            { label: 'კომპანია', icon: Building2, href: '/company', external: true },
            { label: 'აუდიტი', icon: History, href: '/audit-log' },
            { label: 'პარამეტრები', icon: Settings, href: '/settings' },
        ]
    }
]

export default function Sidebar({ branchId }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            {/* Logo Section */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-mark">D</div>
                <div>
                    <h1 className="sidebar-logo-text leading-tight">DASTA</h1>
                    <span className="sidebar-logo-plan">PRO PLAN</span>
                </div>
            </div>

            {/* Branch Switcher Placeholder */}
            <div className="branch-switcher">
                <div>
                    <div className="branch-name">მთავარი ფილიალი</div>
                    <div className="branch-type">საცალო მაღაზია</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 overflow-y-auto pt-2 pb-6 no-scrollbar">
                {navGroups.map((group, gIdx) => (
                    <div key={gIdx} className="sidebar-section">
                        <h3 className="sidebar-section-label">{group.label}</h3>
                        <div className="space-y-1">
                            {group.items.map((item, iIdx) => {
                                const href = item.external ? item.href : `/${branchId}${item.href}`
                                const isActive = item.href === ''
                                    ? pathname === `/${branchId}`
                                    : pathname.startsWith(href)

                                return (
                                    <Link
                                        key={iIdx}
                                        href={href}
                                        className={cn(
                                            'sidebar-item',
                                            isActive && 'active'
                                        )}
                                    >
                                        <item.icon className="icon" />
                                        <span>{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="badge">{item.badge}</span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}
