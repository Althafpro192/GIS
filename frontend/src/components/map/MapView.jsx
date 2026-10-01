// Komponen peta Leaflet choropleth dengan toggle mode & layer control.
import { useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import { formatNumber, formatGrowth } from '@/lib/utils'
import Legend from './Legend'

const { BaseLayer } = LayersControl

// Warna choropleth jumlah penduduk
function getColorPenduduk(val) {
  return val > 120000 ? '#14532d'
       : val > 90000  ? '#166534'
       : val > 70000  ? '#16a34a'
       : val > 50000  ? '#4ade80'
       : val > 30000  ? '#86efac'
       :                '#dcfce7'
}

// Warna choropleth laju pertumbuhan
function getColorLaju(val) {
  return val > 1.5  ? '#14532d'
       : val > 0.8  ? '#16a34a'
       : val > 0.2  ? '#86efac'
       : val >= 0   ? '#fde68a'
       : val > -0.3 ? '#fca5a5'
       :              '#dc2626'
}

// Komponen untuk fit bounds setelah GeoJSON dimuat
function FitBounds({ geojson }) {
  const map = useMap()
  useEffect(() => {
    if (!geojson) return
    const bounds = L.geoJSON(geojson).getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] })
  }, [geojson, map])
  return null
}

export default function MapView({ geojson, data, mode = 'penduduk', onHover, onKecamatanClick }) {
  const geoJsonRef = useRef(null)

  // Cari data kecamatan berdasarkan nama di GeoJSON
  const findData = useCallback((featureName) => {
    if (!data || !featureName) return null
    const name = featureName.toLowerCase().trim()
    return data.find((d) => d.nama_kecamatan.toLowerCase().trim() === name) || null
  }, [data])

  const style = useCallback((feature) => {
    const d = findData(feature.properties?.namobj || feature.properties?.name)
    const val = mode === 'penduduk'
      ? d?.jumlah_penduduk ?? 0
      : d?.laju_pertumbuhan ?? 0
    const fill = mode === 'penduduk' ? getColorPenduduk(val) : getColorLaju(val)
    return {
      fillColor: fill,
      fillOpacity: 0.75,
      color: '#ffffff',
      weight: 1.5,
      opacity: 1,
    }
  }, [findData, mode])

  const onEachFeature = useCallback((feature, layer) => {
    const d = findData(feature.properties?.namobj || feature.properties?.name)

    layer.on('mouseover', () => {
      layer.setStyle({ fillOpacity: 0.95, weight: 2.5 })
      if (onHover) onHover(d)
    })
    layer.on('mouseout', () => {
      layer.setStyle({ fillOpacity: 0.75, weight: 1.5 })
      if (onHover) onHover(null)
    })
    layer.on('click', () => {
      if (onKecamatanClick) onKecamatanClick(d)
    })

    if (d) {
      layer.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:160px">
          <p style="font-weight:600;margin:0 0 6px">${d.nama_kecamatan}</p>
          <table style="font-size:12px;width:100%;border-collapse:collapse">
            <tr><td style="color:#71717a">Penduduk</td><td style="text-align:right;font-weight:500">${formatNumber(d.jumlah_penduduk)} jiwa</td></tr>
            <tr><td style="color:#71717a">Pertumbuhan</td><td style="text-align:right;font-weight:500">${formatGrowth(d.laju_pertumbuhan)}</td></tr>
            <tr><td style="color:#71717a">Luas</td><td style="text-align:right">${d.luas_wilayah} km²</td></tr>
          </table>
        </div>
      `)
    }
  }, [findData, onHover, onKecamatanClick])

  // Re-render GeoJSON layer saat mode atau data berubah
  useEffect(() => {
    if (geoJsonRef.current && geojson) {
      geoJsonRef.current.clearLayers()
      geoJsonRef.current.addData(geojson)
    }
  }, [mode, data, geojson])

  return (
    <MapContainer
      center={[-8.17, 113.7]}
      zoom={10}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </BaseLayer>
        <BaseLayer name="Satelit (Esri)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri"
          />
        </BaseLayer>
      </LayersControl>

      {geojson && (
        <>
          <FitBounds geojson={geojson} />
          <GeoJSON
            ref={geoJsonRef}
            key={`${mode}-${data?.length}`}
            data={geojson}
            style={style}
            onEachFeature={onEachFeature}
          />
        </>
      )}

      <Legend mode={mode} />
    </MapContainer>
  )
}
