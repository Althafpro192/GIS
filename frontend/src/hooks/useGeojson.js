// Hook untuk fetch GeoJSON batas kecamatan Jember.
import { useState, useEffect } from 'react'

export function useGeojson() {
  const [geojson, setGeojson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const url = import.meta.env.VITE_GEOJSON_URL
        const res = await fetch(url)
        if (!res.ok) throw new Error('GeoJSON gagal dimuat.')
        const data = await res.json()
        setGeojson(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { geojson, loading, error }
}
