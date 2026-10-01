// Komponen Modal konfirmasi — portal ke document.body.
import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = 'Konfirmasi', confirmVariant = 'primary', loading = false }) {
  // Tutup modal dengan Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md card p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <h2 id="modal-title" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-fast"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{children}</div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
              {loading ? 'Memproses...' : confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
