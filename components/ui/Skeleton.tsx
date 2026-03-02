'use client'

import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
    )
}

export function StatsSkeleton() {
    return (
        <div className="stats-grid">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="stat-card">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-8 w-32" />
                </div>
            ))}
        </div>
    )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="card no-padding overflow-hidden">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-32 ml-auto" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}
