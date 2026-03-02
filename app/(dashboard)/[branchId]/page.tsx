import {
    TrendingUp,
    Receipt,
    Banknote,
    ArrowUpRight,
    Plus,
    Package,
    Truck,
    ShoppingCart,
    Users,
    History
} from 'lucide-react'

export default async function DashboardPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = await params
    return (
        <div className="animate-fade">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">მთავარი დაფა</h2>
                    <p className="page-subtitle">ინფორმაცია თქვენი ბიზნესის შესახებ</p>
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-md btn-secondary">
                        ექსპორტი
                    </button>
                    <button className="btn btn-md btn-primary">
                        <Plus className="w-4 h-4" /> ახალი გაყიდვა
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-label">გაყიდვები დღეს</div>
                    <div className="stat-card-value">₾ 1,245.50</div>
                    <div className="stat-card-sub up flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> 12.5% გუშინდელთან
                    </div>
                    <div className="stat-card-icon bg-brand-50 text-brand-600">
                        <TrendingUp />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">ჩეკების რაოდენობა</div>
                    <div className="stat-card-value">42</div>
                    <div className="stat-card-sub text-gray-500">საშუალო ჩეკი: ₾ 29.65</div>
                    <div className="stat-card-icon bg-blue-50 text-blue-600">
                        <Receipt />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">თვიური მოგება</div>
                    <div className="stat-card-value">₾ 8,420.00</div>
                    <div className="stat-card-sub up flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> 8.2% წინა თვესთან
                    </div>
                    <div className="stat-card-icon bg-green-50 text-green-600">
                        <Banknote />
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-label">კლიენტების ვალი</div>
                    <div className="stat-card-value text-danger">₾ 350.00</div>
                    <div className="stat-card-sub text-gray-500">7 აქტიური მოვალე</div>
                    <div className="stat-card-icon bg-red-50 text-red-600">
                        <Users />
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <button className="card-sm flex flex-col items-center justify-center gap-2 hover:border-brand-400 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">ახალი გაყიდვა</span>
                </button>
                <button className="card-sm flex flex-col items-center justify-center gap-2 hover:border-blue-400 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">ზედნადები</span>
                </button>
                <button className="card-sm flex flex-col items-center justify-center gap-2 hover:border-amber-400 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">ახალი პროდუქტი</span>
                </button>
                <button className="card-sm flex flex-col items-center justify-center gap-2 hover:border-purple-400 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <History className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">ახალი შეძენა</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 card">
                    <h3 className="font-bold mb-4">გაყიდვების დინამიკა (ბოლო 7 დღე)</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                        აქ ჩაიტვირთება Recharts გრაფიკი
                    </div>
                </div>

                <div className="card">
                    <h3 className="font-bold mb-4">მარაგის გაფრთხილება</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                        !
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold">კოკა-კოლა 0.5ლ</div>
                                        <div className="text-[10px] text-gray-400">მარაგი: 2 ცალი</div>
                                    </div>
                                </div>
                                <button className="text-brand-600 hover:underline text-[10px] font-bold">შეკვეთა</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
