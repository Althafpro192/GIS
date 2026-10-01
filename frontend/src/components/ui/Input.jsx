// Komponen Input dengan label, error message, dan dark mode.
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(function Input(
  { label, id, error, className = '', ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-3 py-2 text-sm rounded-md border bg-white',
          'text-zinc-900 placeholder:text-zinc-400',
          'transition-fast transition-colors',
          'dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
          error
            ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
            : 'border-zinc-200 focus:border-jember-500 dark:border-zinc-700 dark:focus:border-jember-500',
          'focus:outline-none focus:ring-2 focus:ring-jember-500/30',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
})

export default Input
