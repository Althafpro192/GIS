// Legenda choropleth — mounted sebagai Leaflet control.
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const pendudukBreaks = [
  { color: '#14532d', label: '> 120.000' },
  { color: '#166534', label: '90.001 – 120.000' },
  { color: '#16a34a', label: '70.001 – 90.000' },
  { color: '#4ade80', label: '50.001 – 70.000' },
  { color: '#86efac', label: '30.001 – 50.000' },
  { color: '#dcfce7', label: '≤ 30.000' },
]

const lajuBreaks = [
  { color: '#14532d', label: '> 1.5%' },
  { color: '#16a34a', label: '0.8% – 1.5%' },
  { color: '#86efac', label: '0.2% – 0.8%' },
  { color: '#fde68a', label: '0% – 0.2%' },
  { color: '#fca5a5', label: '-0.3% – 0%' },
  { color: '#dc2626', label: '< -0.3%' },
]

export default function Legend({ mode }) {
  const map = useMap()
  const controlRef = useRef(null)

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.remove()
    }

    const breaks = mode === 'penduduk' ? pendudukBreaks : lajuBreaks
    const title  = mode === 'penduduk' ? 'Jumlah Penduduk' : 'Laju Pertumbuhan'

    const control = L.control({ position: 'bottomright' })
    control.onAdd = () => {
      const div = L.DomUtil.create('div', '')
      div.style.cssText = `
        background:white;padding:12px 14px;border-radius:8px;
        border:1px solid #e4e4e7;box-shadow:0 1px 3px rgba(0,0,0,.07);
        font-family:Inter,sans-serif;font-size:11px;color:#3f3f46;min-width:140px
      `
      div.innerHTML = `
        <p style="font-weight:600;margin:0 0 8px;font-size:11px;color:#18181b">${title}</p>
        ${breaks.map(b => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="width:14px;height:14px;border-radius:3px;background:${b.color};display:inline-block;flex-shrink:0"></span>
            <span>${b.label}</span>
          </div>
        `).join('')}
      `
      return div
    }
    control.addTo(map)
    controlRef.current = control

    return () => control.remove()
  }, [map, mode])

  return null
}
