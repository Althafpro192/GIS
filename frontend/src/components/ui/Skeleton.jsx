// Skeleton loader berbasis Tailwind — meniru shape konten.
import { cn } from '@/lib/utils'

export function Skeleton({ className = '', ...props }) {
  return <div className={cn('skeleton', className)} {...props} />
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
    </div>
  )
}
