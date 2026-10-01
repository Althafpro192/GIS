// Toast notification system — tanpa library eksternal.
import { createContext, useContext, useCallback, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border shadow-lg text-sm',
              'animate-in slide-in-from-right-4 fade-in duration-200',
              toast.type === 'success'
                ? 'bg-white border-jember-200 text-jember-800 dark:bg-zinc-900 dark:border-jember-800 dark:text-jember-300'
                : 'bg-white border-red-200 text-red-800 dark:bg-zinc-900 dark:border-red-800 dark:text-red-300',
            )}
          >
            {toast.type === 'success'
              ? <CheckCircle size={16} className="mt-0.5 shrink-0 text-jember-600" />
              : <XCircle size={16} className="mt-0.5 shrink-0 text-red-600" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="text-zinc-400 hover:text-zinc-600 transition-fast">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return ctx
}
