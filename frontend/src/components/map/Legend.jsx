/**
 * Legend — Leaflet control choropleth.
 * Dirender sebagai control Leaflet biasa di pojok kanan bawah.
 */
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const PENDUDUK_BREAKS = [
  { color: '#14532d', label: '> 120.000 jiwa' },
  { color: '#166534', label: '90.001 – 120.000' },
  { color: '#16a34a', label: '70.001 – 90.000' },
  { color: '#4ade80', label: '50.001 – 70.000' },
  { color: '#86efac', label: '30.001 – 50.000' },
  { color: '#d1fae5', label: '≤ 30.000' },
]

const LAJU_BREAKS = [
  { color: '#14532d', label: '> 1.5%' },
  { color: '#16a34a', label: '0.8% – 1.5%' },
  { color: '#86efac', label: '0.2% – 0.8%' },
  { color: '#fde68a', label: '0% – 0.2%' },
  { color: '#fca5a5', label: '-0.3% – 0%' },
  { color: '#dc2626', label: '< -0.3%' },
]

export default function Legend({ mode }) {
  const map        = useMap()
  const controlRef = useRef(null)

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.remove()
      controlRef.current = null
    }

    const breaks = mode === 'penduduk' ? PENDUDUK_BREAKS : LAJU_BREAKS
    const title  = mode === 'penduduk' ? 'Jumlah Penduduk' : 'Laju Pertumbuhan'

    const ctrl = L.control({ position: 'bottomright' })
    ctrl.onAdd = () => {
      const div = L.DomUtil.create('div', '')
      div.style.cssText = [
        'background:rgba(255,255,255,0.96)',
        'padding:12px 15px',
        'border-radius:10px',
        'border:1px solid #e4e4e7',
        'box-shadow:0 4px 12px rgba(0,0,0,0.12)',
        'font-family:Inter,system-ui,sans-serif',
        'font-size:11.5px',
        'color:#3f3f46',
        'min-width:155px',
        'backdrop-filter:blur(4px)',
      ].join(';')

      div.innerHTML = `
        <p style="font-weight:700;margin:0 0 10px;font-size:12px;
                  color:#18181b;letter-spacing:.01em">${title}</p>
        ${breaks.map(b => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
            <span style="
              width:16px;height:16px;border-radius:4px;
              background:${b.color};display:inline-block;flex-shrink:0;
              border:1px solid rgba(0,0,0,.10)">
            </span>
            <span style="font-size:11px">${b.label}</span>
          </div>
        `).join('')}
      `
      return div
    }
    ctrl.addTo(map)
    controlRef.current = ctrl

    return () => ctrl.remove()
  }, [map, mode])

  return null
}
