// Form create/edit kecamatan — dipakai di /admin/kecamatan/baru dan /:id/edit.
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/ui/Toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const schema = z.object({
  kode_kecamatan:   z.string().min(3, 'Min 3 karakter').max(10, 'Maks 10 karakter').optional().or(z.literal('')),
  nama_kecamatan:   z.string().min(2, 'Min 2 karakter').max(50, 'Maks 50 karakter'),
  jumlah_penduduk:  z.coerce.number().int('Harus bilangan bulat').min(1, 'Min 1').max(1000000, 'Maks 1.000.000'),
  laju_pertumbuhan: z.coerce.number().min(-5, 'Min -5').max(10, 'Maks 10'),
  luas_wilayah:     z.coerce.number().min(0.01, 'Min 0.01'),
  jumlah_faskes:    z.coerce.number().int().min(0, 'Min 0').optional().default(0),
  jumlah_rentan:    z.coerce.number().int().min(0, 'Min 0').optional().default(0),
  latitude:         z.coerce.number().min(-90, 'Min -90').max(90, 'Maks 90'),
  longitude:        z.coerce.number().min(-180, 'Min -180').max(180, 'Maks 180'),
})

export default function KecamatanFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const addToast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  // Load data saat mode edit
  useEffect(() => {
    if (!isEdit) return
    async function loadData() {
      try {
        const res = await api.get('/kecamatan.php')
        const found = res.data.data.find((d) => String(d.id) === id)
        if (found) reset(found)
      } catch {
        addToast({ message: 'Gagal memuat data.', type: 'error' })
      }
    }
    loadData()
  }, [id, isEdit]) // eslint-disable-line

  async function onSubmit(values) {
    try {
      if (isEdit) {
        await api.put(`/kecamatan.php?id=${id}`, values)
        addToast({ message: 'Kecamatan berhasil diperbarui.', type: 'success' })
      } else {
        await api.post('/kecamatan.php', values)
        addToast({ message: 'Kecamatan berhasil ditambahkan.', type: 'success' })
      }
      navigate('/admin/kecamatan')
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan.'
      addToast({ message: msg, type: 'error' })
    }
  }

  const fields = [
    { name: 'nama_kecamatan',   label: 'Nama Kecamatan',   type: 'text',   placeholder: 'cth. Sumbersari', required: true },
    { name: 'jumlah_penduduk',  label: 'Jumlah Penduduk',  type: 'number', placeholder: '132500', required: true },
    { name: 'laju_pertumbuhan', label: 'Laju Pertumbuhan (%)', type: 'number', placeholder: '1.50', step: '0.01', required: true },
    { name: 'luas_wilayah',     label: 'Luas Wilayah (km²)', type: 'number', placeholder: '37.00', step: '0.01', required: true },
    { name: 'jumlah_faskes',    label: 'Jumlah Faskes',    type: 'number', placeholder: '14' },
    { name: 'jumlah_rentan',    label: 'Penduduk Rentan',  type: 'number', placeholder: '3100' },
    { name: 'latitude',         label: 'Latitude',         type: 'number', placeholder: '-8.162', step: '0.0000001', required: true },
    { name: 'longitude',        label: 'Longitude',        type: 'number', placeholder: '113.723', step: '0.0000001', required: true },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/kecamatan')}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-fast mb-3"
        >
          <ArrowLeft size={13} /> Kembali ke Daftar
        </button>
        <h1 className="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
          {isEdit ? 'Edit Kecamatan' : 'Tambah Kecamatan'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {/* Kode — hanya di mode create */}
          {!isEdit && (
            <Input
              id="kode_kecamatan"
              label="Kode Kecamatan"
              type="text"
              placeholder="cth. 3509300"
              error={errors.kode_kecamatan?.message}
              {...register('kode_kecamatan')}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, label, type, placeholder, step, required }) => (
              <Input
                key={name}
                id={name}
                label={`${label}${required ? ' *' : ''}`}
                type={type}
                placeholder={placeholder}
                step={step}
                error={errors[name]?.message}
                {...register(name)}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 divider">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/kecamatan')}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Kecamatan'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
