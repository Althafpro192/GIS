// Hook untuk fetch dan cache data kecamatan dari API.
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

export function useKecamatan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/kecamatan.php')
      setData(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}
