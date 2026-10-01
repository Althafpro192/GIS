// Halaman 404.
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-serif font-bold text-zinc-200 dark:text-zinc-800 select-none">404</p>
        <h1 className="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          URL yang Anda akses tidak tersedia.
        </p>
        <Link to="/">
          <Button variant="primary">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  )
}
