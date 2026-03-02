import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { branchId: string }
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar branchId={params.branchId} />

            <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
                <Topbar />
                <main className="main-content no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
