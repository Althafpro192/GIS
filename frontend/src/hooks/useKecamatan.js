import { useEffect, useState } from 'react'
import api from '@/lib/api'

export function useKecamatan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    api.get('/kecamatan.php')
      .then((res) => {
        if (cancelled) return
        console.log('[useKecamatan] raw:', res.data)
        const rows = Array.isArray(res.data) ? res.data : (res.data && res.data.data) || []
        console.log('[useKecamatan] rows:', rows.length)
        setData(rows)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[useKecamatan] error:', err)
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}