<?php
// API CRUD data kecamatan. GET publik; POST/PUT/DELETE memerlukan sesi + CSRF.

require_once __DIR__ . '/../koneksi.php';
require_once __DIR__ . '/_middleware.php';

// CORS
$allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// ------- GET — publik -------
if ($method === 'GET') {
    $result = $conn->query(
        "SELECT id, kode_kecamatan, nama_kecamatan, jumlah_penduduk, laju_pertumbuhan,
                luas_wilayah, jumlah_faskes, jumlah_rentan, latitude, longitude
         FROM data_kecamatan
         ORDER BY nama_kecamatan ASC"
    );

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        // Cast numerik agar JSON tidak serialise sebagai string
        $row['jumlah_penduduk']  = (int)   $row['jumlah_penduduk'];
        $row['laju_pertumbuhan'] = (float) $row['laju_pertumbuhan'];
        $row['luas_wilayah']     = (float) $row['luas_wilayah'];
        $row['jumlah_faskes']    = (int)   $row['jumlah_faskes'];
        $row['jumlah_rentan']    = (int)   $row['jumlah_rentan'];
        $row['latitude']         = (float) $row['latitude'];
        $row['longitude']        = (float) $row['longitude'];
        $rows[] = $row;
    }

    jsonResponse(['success' => true, 'message' => 'OK', 'data' => $rows]);
}

// ------- Endpoint terproteksi: wajib login + CSRF -------
requireAuth();
requireCsrf();

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$rules = [
    'nama_kecamatan'    => ['type' => 'string',  'required' => true,  'min' => 2, 'max' => 50],
    'jumlah_penduduk'   => ['type' => 'int',     'required' => true,  'min' => 1, 'max' => 1000000],
    'laju_pertumbuhan'  => ['type' => 'float',   'required' => true,  'min' => -5, 'max' => 10],
    'luas_wilayah'      => ['type' => 'float',   'required' => true,  'min' => 0],
    'jumlah_faskes'     => ['type' => 'int',     'required' => false, 'min' => 0],
    'jumlah_rentan'     => ['type' => 'int',     'required' => false, 'min' => 0],
    'latitude'          => ['type' => 'float',   'required' => true,  'min' => -90,  'max' => 90],
    'longitude'         => ['type' => 'float',   'required' => true,  'min' => -180, 'max' => 180],
];

// ------- POST — buat kecamatan baru -------
if ($method === 'POST') {
    $d = validateInput($body, array_merge(
        ['kode_kecamatan' => ['type' => 'string', 'required' => true, 'min' => 3, 'max' => 10]],
        $rules
    ));

    // Cek unik nama
    $chk = $conn->prepare("SELECT id FROM data_kecamatan WHERE nama_kecamatan = ?");
    $chk->bind_param('s', $d['nama_kecamatan']);
    $chk->execute();
    if ($chk->get_result()->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'Nama kecamatan sudah ada.', 'data' => null], 409);
    }

    $stmt = $conn->prepare(
        "INSERT INTO data_kecamatan
            (kode_kecamatan, nama_kecamatan, jumlah_penduduk, laju_pertumbuhan,
             luas_wilayah, jumlah_faskes, jumlah_rentan, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        'ssiddiidd',
        $d['kode_kecamatan'],
        $d['nama_kecamatan'],
        $d['jumlah_penduduk'],
        $d['laju_pertumbuhan'],
        $d['luas_wilayah'],
        $d['jumlah_faskes'],
        $d['jumlah_rentan'],
        $d['latitude'],
        $d['longitude']
    );
    $stmt->execute();

    jsonResponse(['success' => true, 'message' => 'Kecamatan berhasil ditambahkan.', 'data' => ['id' => $conn->insert_id]], 201);
}

// ------- PUT — update kecamatan -------
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID tidak valid.', 'data' => null], 400);
    }

    $d = validateInput($body, $rules);

    // Cek unik nama (kecuali dirinya sendiri)
    $chk = $conn->prepare("SELECT id FROM data_kecamatan WHERE nama_kecamatan = ? AND id != ?");
    $chk->bind_param('si', $d['nama_kecamatan'], $id);
    $chk->execute();
    if ($chk->get_result()->num_rows > 0) {
        jsonResponse(['success' => false, 'message' => 'Nama kecamatan sudah dipakai kecamatan lain.', 'data' => null], 409);
    }

    $stmt = $conn->prepare(
        "UPDATE data_kecamatan
         SET nama_kecamatan=?, jumlah_penduduk=?, laju_pertumbuhan=?,
             luas_wilayah=?, jumlah_faskes=?, jumlah_rentan=?, latitude=?, longitude=?
         WHERE id=?"
    );
    $stmt->bind_param(
        'siddiiddi',
        $d['nama_kecamatan'],
        $d['jumlah_penduduk'],
        $d['laju_pertumbuhan'],
        $d['luas_wilayah'],
        $d['jumlah_faskes'],
        $d['jumlah_rentan'],
        $d['latitude'],
        $d['longitude'],
        $id
    );
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        jsonResponse(['success' => false, 'message' => 'Data tidak ditemukan atau tidak ada perubahan.', 'data' => null], 404);
    }

    jsonResponse(['success' => true, 'message' => 'Kecamatan berhasil diperbarui.', 'data' => null]);
}

// ------- DELETE — hapus kecamatan -------
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        jsonResponse(['success' => false, 'message' => 'ID tidak valid.', 'data' => null], 400);
    }

    $stmt = $conn->prepare("DELETE FROM data_kecamatan WHERE id=?");
    $stmt->bind_param('i', $id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        jsonResponse(['success' => false, 'message' => 'Data tidak ditemukan.', 'data' => null], 404);
    }

    jsonResponse(['success' => true, 'message' => 'Kecamatan berhasil dihapus.', 'data' => null]);
}

jsonResponse(['success' => false, 'message' => 'Method tidak didukung.', 'data' => null], 405);
