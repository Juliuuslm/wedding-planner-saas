import { KpiRowSkeleton, CardGridSkeleton, TableSkeleton } from '@/components/ui/PageSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-56" />
      </div>
      <KpiRowSkeleton count={4} />
      <section>
        <Skeleton className="mb-4 h-5 w-32" />
        <CardGridSkeleton count={3} cols={3} />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <Skeleton className="mb-4 h-5 w-32" />
          <TableSkeleton rows={5} cols={3} />
        </section>
        <section>
          <Skeleton className="mb-4 h-5 w-32" />
          <TableSkeleton rows={3} cols={3} />
        </section>
      </div>
    </div>
  )
}
