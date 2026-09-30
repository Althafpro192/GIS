<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web GIS & SPK Kependudukan Jember</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
    <style>
        #map { height: 480px; width: 100%; border-radius: 8px; }
        .legend { background: white; padding: 10px; border-radius: 5px; line-height: 18px; color: #555; box-shadow: 0 0 15px rgba(0,0,0,0.2); }
        .legend i { width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7; }
    </style>
</head>
<body class="bg-light">

<div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h2 class="fw-bold m-0">Web GIS & SPK Kependudukan Kabupaten Jember</h2>
            <p class="text-muted m-0">Visualisasi Spasial Kepadatan Penduduk & Penentuan Prioritas Bantuan (Metode SAW)</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTambah">+ Tambah Data</button>
    </div>

    <!-- Peta Tematik Keruangan -->
    <div class="card mb-4 shadow-sm">
        <div class="card-body p-2">
            <div id="map"></div>
        </div>
    </div>

    <!-- Tabel Data + Fitur Find, Sort, SPK -->
    <div class="card shadow-sm">
        <div class="card-body">
            <h5 class="fw-bold mb-3">Data Wilayah & Perhitungan SPK</h5>
            
            <div class="row g-2 mb-3">
                <div class="col-md-8">
                    <input type="text" id="searchInput" class="form-control" placeholder="Cari Kecamatan (Fitur Find)..." onkeyup="filterTable()">
                </div>
                <div class="col-md-4">
                    <select id="sortSelect" class="form-select" onchange="sortTable()">
                        <option value="spk">Urutkan: Ranking SPK (Prioritas)</option>
                        <option value="penduduk">Urutkan: Jumlah Penduduk</option>
                        <option value="nama">Urutkan: Nama Kecamatan</option>
                    </select>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Rank</th>
                            <th>Kode</th>
                            <th>Kecamatan</th>
                            <th>Penduduk</th>
                            <th>Luas (km²)</th>
                            <th>Kepadatan (/km²)</th>
                            <th>Skor SPK</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Modal Tambah Data (CRUD) -->
<div class="modal fade" id="modalTambah" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Tambah Data Kecamatan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="formTambah">
            <div class="mb-2"><label>Kode Kecamatan</label><input type="text" id="kode" class="form-control" required></div>
            <div class="mb-2"><label>Nama Kecamatan</label><input type="text" id="nama" class="form-control" required></div>
            <div class="mb-2"><label>Jumlah Penduduk</label><input type="number" id="penduduk" class="form-control" required></div>
            <div class="mb-2"><label>Luas Wilayah (km²)</label><input type="number" step="0.01" id="luas" class="form-control" required></div>
            <div class="mb-2"><label>Jumlah Faskes</label><input type="number" id="faskes" class="form-control" required></div>
            <div class="mb-2"><label>Jumlah Penduduk Rentan</label><input type="number" id="rentan" class="form-control" required></div>
            <button type="submit" class="btn btn-primary w-100 mt-3">Simpan Data</button>
        </form>
      </div>
    </div>
  </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
let map = L.map('map').setView([-8.1721, 113.7000], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let rawData = [];
let geojsonLayer;

function getColor(d) {
    return d > 3000 ? '#800026' :
           d > 2000 ? '#BD0026' :
           d > 1000 ? '#E31A1C' :
           d > 500  ? '#FC4E2A' : '#FD8D3C';
}

async function loadData() {
    const res = await fetch('api.php?action=read');
    rawData = await res.json();
    renderTable(rawData);
    loadMap();
}

async function loadMap() {
    const geoRes = await fetch('jember_kecamatan.geojson');
    const geoData = await geoRes.json();

    if(geojsonLayer) map.removeLayer(geojsonLayer);

    geojsonLayer = L.geoJson(geoData, {
        style: function(feature) {
            let kData = rawData.find(d => d.nama_kecamatan.toLowerCase() === feature.properties.namobj?.toLowerCase());
            let density = kData ? kData.kepadatan : 0;
            return { fillColor: getColor(density), weight: 1, opacity: 1, color: 'white', fillOpacity: 0.7 };
        },
        onEachFeature: function(feature, layer) {
            let kData = rawData.find(d => d.nama_kecamatan.toLowerCase() === feature.properties.namobj?.toLowerCase());
            if(kData) {
                layer.bindPopup(`<b>Kecamatan ${kData.nama_kecamatan}</b><br>
                                 Jumlah Penduduk: ${Number(kData.jumlah_penduduk).toLocaleString()} jiwa<br>
                                 Kepadatan: ${kData.kepadatan} jiwa/km²<br>
                                 Skor Prioritas SPK: <b>${kData.skor_spk}</b>`);
            }
        }
    }).addTo(map);
}

function renderTable(data) {
    let html = '';
    data.forEach((row, idx) => {
        html += `<tr>
            <td><span class="badge bg-${idx === 0 ? 'danger' : idx < 3 ? 'warning' : 'secondary'}">${idx + 1}</span></td>
            <td>${row.kode_kecamatan}</td>
            <td><b>${row.nama_kecamatan}</b></td>
            <td>${Number(row.jumlah_penduduk).toLocaleString()}</td>
            <td>${row.luas_wilayah}</td>
            <td>${row.kepadatan}</td>
            <td><span class="fw-bold text-primary">${row.skor_spk}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteData(${row.id})">Hapus</button>
            </td>
        </tr>`;
    });
    document.getElementById('tableBody').innerHTML = html;
}

function filterTable() {
    let q = document.getElementById('searchInput').value.toLowerCase();
    let filtered = rawData.filter(d => d.nama_kecamatan.toLowerCase().includes(q));
    renderTable(filtered);
}

function sortTable() {
    let mode = document.getElementById('sortSelect').value;
    let sorted = [...rawData];
    if(mode === 'spk') sorted.sort((a,b) => b.skor_spk - a.skor_spk);
    if(mode === 'penduduk') sorted.sort((a,b) => b.jumlah_penduduk - a.jumlah_penduduk);
    if(mode === 'nama') sorted.sort((a,b) => a.nama_kecamatan.localeCompare(b.nama_kecamatan));
    renderTable(sorted);
}

document.getElementById('formTambah').addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        action: 'create',
        kode_kecamatan: document.getElementById('kode').value,
        nama_kecamatan: document.getElementById('nama').value,
        jumlah_penduduk: parseInt(document.getElementById('penduduk').value),
        luas_wilayah: parseFloat(document.getElementById('luas').value),
        jumlah_faskes: parseInt(document.getElementById('faskes').value),
        jumlah_rentan: parseInt(document.getElementById('rentan').value)
    };

    await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    bootstrap.Modal.getInstance(document.getElementById('modalTambah')).hide();
    document.getElementById('formTambah').reset();
    loadData();
});

async function deleteData(id) {
    if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: id })
        });
        loadData();
    }
}

loadData();
</script>
</body>
</html>
