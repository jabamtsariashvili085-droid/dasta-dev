import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ branchId: string }>
}) {
    const { branchId } = await params
    return (
        <div className="dashboard-layout">
            <Sidebar branchId={branchId} />

            <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
                <Topbar />
                <main className="main-content no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
