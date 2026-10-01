// Toggle untuk memilih chart yang ditampilkan.
import { cn } from '@/lib/utils'

export default function ChartToggle({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden text-xs">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1.5 font-medium transition-fast',
            value === opt.value
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
