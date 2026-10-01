// Komponen Button dengan varian dan size yang konsisten.
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-jember-600 text-white hover:bg-jember-700 border-transparent',
  secondary:
    'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 border-transparent',
  ghost:
    'bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 font-medium border rounded-md',
        'transition-fast transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
