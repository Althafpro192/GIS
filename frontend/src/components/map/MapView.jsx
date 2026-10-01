/**
 * MapView — Choropleth Leaflet dengan vanilla L.geoJSON() untuk
 * full-control styling, label kecamatan permanen (tampil zoom≥11),
 * dan re-render dinamis saat mode / data berubah.
 */
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import { formatNumber, formatGrowth } from '@/lib/utils'
import Legend from './Legend'

const { BaseLayer } = LayersControl

/* ══════════════════════════════════════════════════════════════════════════
   PALETTE & STYLE HELPERS
══════════════════════════════════════════════════════════════════════════ */

/** Gradasi hijau untuk Jumlah Penduduk */
function colorPenduduk(v) {
  const n = Number(v) || 0
  return n > 120000 ? '#14532d'
       : n > 90000  ? '#166534'
       : n > 70000  ? '#16a34a'
       : n > 50000  ? '#4ade80'
       : n > 30000  ? '#86efac'
       :              '#d1fae5'
}

/** Diverging merah–kuning–hijau untuk Laju Pertumbuhan */
function colorLaju(v) {
  const n = Number(v) || 0
  return n >  1.5 ? '#14532d'
       : n >  0.8 ? '#16a34a'
       : n >  0.2 ? '#86efac'
       : n >= 0   ? '#fde68a'
       : n > -0.3 ? '#fca5a5'
       :            '#dc2626'
}

/** Normalisasi nama: lowercase + hapus semua spasi */
const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '')

/** Cari baris DB berdasarkan properties GeoJSON */
function findRow(props, data) {
  if (!props || !data || !data.length) return null
  const key = norm(props.nama || props.namobj || props.name || '')
  return data.find((d) => norm(d.nama_kecamatan) === key) || null
}

/** Buat objek style Leaflet */
function makeStyle(row, mode, highlight = false) {
  const val  = mode === 'penduduk'
    ? Number(row?.jumlah_penduduk)   || 0
    : Number(row?.laju_pertumbuhan)  || 0
  const fill = mode === 'penduduk' ? colorPenduduk(val) : colorLaju(val)
  return {
    fillColor  : fill,
    fillOpacity: highlight ? 0.95 : 0.80,
    color      : '#ffffff',
    weight     : highlight ? 2.5  : 1.5,
    opacity    : 1,
  }
}

/** HTML popup detail kecamatan */
function popupHtml(row) {
  const positif  = Number(row.laju_pertumbuhan) >= 0
  const lajuColor = positif ? '#16a34a' : '#dc2626'
  return `
    <div style="font-family:Inter,sans-serif;min-width:190px;padding:4px 0">
      <p style="font-weight:700;font-size:13px;margin:0 0 10px;
                color:#18181b;border-bottom:2px solid #e4e4e7;padding-bottom:8px">
        ${row.nama_kecamatan}
      </p>
      <table style="font-size:12px;width:100%;border-collapse:collapse;line-height:1.7">
        <tr>
          <td style="color:#71717a">Jumlah Penduduk</td>
          <td style="text-align:right;font-weight:700;color:#16a34a">
            ${formatNumber(row.jumlah_penduduk)} jiwa
          </td>
        </tr>
        <tr>
          <td style="color:#71717a">Laju Pertumbuhan</td>
          <td style="text-align:right;font-weight:700;color:${lajuColor}">
            ${formatGrowth(row.laju_pertumbuhan)}
          </td>
        </tr>
        <tr>
          <td style="color:#71717a">Luas Wilayah</td>
          <td style="text-align:right;color:#3f3f46">
            ${row.luas_wilayah} km²
          </td>
        </tr>
        <tr>
          <td style="color:#71717a">Faskes</td>
          <td style="text-align:right;color:#3f3f46">
            ${row.jumlah_faskes} unit
          </td>
        </tr>
      </table>
    </div>
  `
}

/* ══════════════════════════════════════════════════════════════════════════
   INNER COMPONENT — akses map instance via useMap()
══════════════════════════════════════════════════════════════════════════ */
function ChoroplethLayer({ geojson, data, mode, onHover }) {
  const map      = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    /* Selalu hapus layer lama sebelum membuat yang baru */
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }

    if (!geojson || !data || data.length === 0) return

    const layer = L.geoJSON(geojson, {
      /* ── Style tiap feature ──────────────────────────────────────── */
      style(feature) {
        const row = findRow(feature.properties, data)
        return makeStyle(row, mode)
      },

      /* ── Event & tooltip per feature ─────────────────────────────── */
      onEachFeature(feature, fl) {
        const row      = findRow(feature.properties, data)
        const geoLabel = feature.properties?.nama
                      || feature.properties?.namobj
                      || feature.properties?.name
                      || '?'

        /* Tooltip: nama kecamatan — permanen saat zoom ≥ 11 */
        fl.bindTooltip(geoLabel, {
          permanent : false,   // mulai tidak permanen
          direction : 'center',
          className : 'kec-tooltip',
          opacity   : 0.9,
        })

        /* Hover */
        fl.on('mouseover', function () {
          this.setStyle(makeStyle(row, mode, true))
          this.openTooltip()
          if (onHover) onHover(row)
        })
        fl.on('mouseout', function () {
          this.setStyle(makeStyle(row, mode, false))
          if (onHover) onHover(null)
        })

        /* Popup detail saat klik */
        if (row) {
          fl.bindPopup(popupHtml(row), { maxWidth: 280 })
          fl.on('click', function () {
            this.openPopup()
          })
        } else {
          fl.bindPopup(
            `<p style="font-family:Inter,sans-serif;font-size:12px;color:#71717a;margin:0">
              <strong>${geoLabel}</strong><br/>Data belum tersedia.
            </p>`,
          )
        }
      },
    })

    layer.addTo(map)
    layerRef.current = layer

    /* Zoom-dependent permanent tooltip */
    const updateTooltips = () => {
      const permanent = map.getZoom() >= 11
      layer.eachLayer((fl) => {
        const tt = fl.getTooltip()
        if (!tt) return
        fl.unbindTooltip()
        const geoLabel = fl.feature?.properties?.nama
                       || fl.feature?.properties?.namobj
                       || fl.feature?.properties?.name
                       || ''
        fl.bindTooltip(geoLabel, {
          permanent,
          direction : 'center',
          className : 'kec-tooltip',
          opacity   : 0.9,
        })
        if (permanent) fl.openTooltip()
      })
    }

    map.on('zoomend', updateTooltips)
    updateTooltips() // run once

    /* Fit ke batas Kabupaten Jember */
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [10, 10] })
    }

    return () => {
      map.off('zoomend', updateTooltips)
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  /* Rebuild layer setiap kali geojson, data, atau mode berubah */
  }, [map, geojson, data, mode, onHover])

  return null
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════ */
export default function MapView({ geojson, data, mode = 'penduduk', onHover }) {
  const ready = geojson && data && data.length > 0

  return (
    <MapContainer
      center={[-8.17, 113.7]}
      zoom={10}
      minZoom={9}
      maxZoom={16}
      className="h-full w-full z-0"
      scrollWheelZoom={true}
    >
      {/* ── Base layers ──────────────────────────────────────── */}
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

      {/* ── Choropleth layer — hanya render saat data siap ─── */}
      {ready && (
        <ChoroplethLayer
          geojson={geojson}
          data={data}
          mode={mode}
          onHover={onHover}
        />
      )}

      {/* ── Legend ───────────────────────────────────────────── */}
      <Legend mode={mode} />
    </MapContainer>
  )
}
