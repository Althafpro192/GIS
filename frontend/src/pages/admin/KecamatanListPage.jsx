// Halaman daftar kecamatan — tabel admin dengan edit & hapus.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useKecamatan } from '@/hooks/useKecamatan'
import { useToast } from '@/components/ui/Toast'
import api from '@/lib/api'
import { formatNumber, formatGrowth } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { SkeletonTable } from '@/components/ui/Skeleton'

export default function KecamatanListPage() {
  const { data, loading, refetch } = useKecamatan()
  const addToast = useToast()
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/kecamatan.php?id=${deleteTarget.id}`)
      addToast({ message: `${deleteTarget.nama_kecamatan} berhasil dihapus.`, type: 'success' })
      refetch()
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Gagal menghapus data.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
            Data Kecamatan
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {data.length} kecamatan terdaftar
          </p>
        </div>
        <Link to="/admin/kecamatan/baru">
          <Button>
            <Plus size={14} /> Tambah
          </Button>
        </Link>
      </div>

      {/* Tabel */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-5">
            <SkeletonTable rows={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  {['Kecamatan', 'Penduduk', 'Laju (%)', 'Luas (km²)', 'Lat', 'Lng', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-fast"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {row.nama_kecamatan}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {formatNumber(row.jumlah_penduduk)}
                    </td>
                    <td className={`px-4 py-3 font-medium ${row.laju_pertumbuhan >= 0 ? 'text-jember-600' : 'text-red-500'}`}>
                      {formatGrowth(row.laju_pertumbuhan)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.luas_wilayah}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{row.latitude}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs font-mono">{row.longitude}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/kecamatan/${row.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            <Pencil size={12} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal konfirmasi hapus */}
      <Modal
        open={!!deleteTarget}
        title="Hapus Kecamatan"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Ya, Hapus"
        confirmVariant="danger"
        loading={deleting}
      >
        Apakah Anda yakin ingin menghapus{' '}
        <span className="font-semibold">{deleteTarget?.nama_kecamatan}</span>?
        Tindakan ini tidak dapat dibatalkan.
      </Modal>
    </div>
  )
}
