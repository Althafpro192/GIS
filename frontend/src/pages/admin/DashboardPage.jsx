// Dashboard admin — ringkasan statistik + aksi cepat.
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, MapPin, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react'
import { useKecamatan } from '@/hooks/useKecamatan'
import { computeStats, formatNumber, formatGrowth } from '@/lib/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SkeletonCard } from '@/components/ui/Skeleton'
import useAuthStore from '@/stores/authStore'

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <Card className="flex items-start gap-4">
      <div className={`p-2.5 rounded-md ${accent}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">{label}</p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 truncate">{value}</p>
        {sub && <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{sub}</p>}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { data, loading } = useKecamatan()
  const { user } = useAuthStore()
  const stats = useMemo(() => computeStats(data), [data])

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Heading */}
      <div>
        <p className="text-xs text-zinc-400 mb-1">Panel Admin</p>
        <h1 className="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
          Selamat datang, {user?.username}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Kelola data kependudukan 31 kecamatan Kabupaten Jember.
        </p>
      </div>

      {/* Stat cards */}
      <section>
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Ringkasan Data</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !stats ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard icon={Users} label="Total Penduduk" value={formatNumber(stats.total)} sub="seluruh kecamatan" accent="bg-jember-600" />
              <StatCard icon={MapPin} label="Terpadat" value={stats.terpadat.nama_kecamatan} sub={formatNumber(stats.terpadat.jumlah_penduduk)} accent="bg-amber-500" />
              <StatCard icon={TrendingUp} label="Tumbuh Tercepat" value={stats.tercepat.nama_kecamatan} sub={formatGrowth(stats.tercepat.laju_pertumbuhan)} accent="bg-jember-700" />
              <StatCard icon={TrendingDown} label="Laju Negatif" value={`${stats.negatif} kec.`} sub="mengalami penurunan" accent="bg-red-500" />
            </>
          )}
        </div>
      </section>

      {/* Aksi cepat */}
      <section>
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Tambah Data Kecamatan</p>
              <p className="text-xs text-zinc-400 mt-0.5">Buat entri kecamatan baru</p>
            </div>
            <Link to="/admin/kecamatan/baru">
              <Button size="sm" variant="primary">
                <Plus size={13} /> Tambah
              </Button>
            </Link>
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Kelola Data Kecamatan</p>
              <p className="text-xs text-zinc-400 mt-0.5">{data.length} kecamatan terdaftar</p>
            </div>
            <Link to="/admin/kecamatan">
              <Button size="sm" variant="secondary">
                Lihat <ArrowRight size={13} />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
