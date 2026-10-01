// Komponen Card wrapper dengan padding dan border.
import { cn } from '@/lib/utils'

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'card p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('mb-4', className)}>{children}</div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-base font-semibold text-zinc-900 dark:text-zinc-100', className)}>
      {children}
    </h3>
  )
}
