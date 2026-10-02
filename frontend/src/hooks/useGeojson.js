import { useEffect, useState } from 'react'

let cachedGeojson = null

export function useGeojson() {
  const [geojson, setGeojson] = useState(cachedGeojson)
  const [loading, setLoading] = useState(!cachedGeojson)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cachedGeojson) {
      setGeojson(cachedGeojson)
      setLoading(false)
      return
    }

    let cancelled = false

    fetch('/jember_kecamatan.geojson')
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP ' + res.status)
        }
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        console.log('[useGeojson] features:', json.features.length)
        cachedGeojson = json
        setGeojson(json)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[useGeojson] error:', err)
        setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { geojson, loading, error }
}