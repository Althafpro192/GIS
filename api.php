<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

$action = $_GET['action'] ?? '';

// GET: Ambil Data & Hitung SPK (Metode SAW)
if ($action === 'read') {
    $result = $conn->query("SELECT *, ROUND(jumlah_penduduk/luas_wilayah, 2) AS kepadatan FROM data_kecamatan");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    if (count($data) > 0) {
        // Cari Nilai Max/Min untuk Normalisasi Matrix SAW
        $max_kepadatan = max(array_column($data, 'kepadatan')) ?: 1;
        $max_rentan    = max(array_column($data, 'jumlah_rentan')) ?: 1;
        $min_faskes    = min(array_column($data, 'jumlah_faskes')) ?: 1;

        // Hitung Skor Akhir SPK SAW
        foreach ($data as &$item) {
            $norm_kepadatan = $item['kepadatan'] / $max_kepadatan;
            $norm_rentan    = $item['jumlah_rentan'] / $max_rentan;
            $norm_faskes    = $min_faskes / ($item['jumlah_faskes'] ?: 1);

            // Bobot: Kepadatan 30%, Rentan 50%, Faskes 20%
            $item['skor_spk'] = round(($norm_kepadatan * 0.3) + ($norm_rentan * 0.5) + ($norm_faskes * 0.2), 4);
        }

        // Urutkan berdasarkan Ranking SPK Tertinggi
        usort($data, function($a, $b) {
            return $b['skor_spk'] <=> $a['skor_spk'];
        });
    }

    echo json_encode($data);
    exit;
}

// POST: Operasi CRUD (Create, Update, Delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $act = $input['action'] ?? '';

    if ($act === 'create') {
        $stmt = $conn->prepare("INSERT INTO data_kecamatan (kode_kecamatan, nama_kecamatan, jumlah_penduduk, luas_wilayah, jumlah_faskes, jumlah_rentan) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiddi", $input['kode_kecamatan'], $input['nama_kecamatan'], $input['jumlah_penduduk'], $input['luas_wilayah'], $input['jumlah_faskes'], $input['jumlah_rentan']);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Data berhasil ditambahkan"]);
    } 
    elseif ($act === 'delete') {
        $stmt = $conn->prepare("DELETE FROM data_kecamatan WHERE id=?");
        $stmt->bind_param("i", $input['id']);
        $stmt->execute();
        echo json_encode(["status" => "success", "message" => "Data berhasil dihapus"]);
    }
}
?>