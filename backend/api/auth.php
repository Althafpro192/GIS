<?php
// API autentikasi: login, logout, dan cek sesi aktif.

require_once __DIR__ . '/../koneksi.php';
require_once __DIR__ . '/_middleware.php';

// CORS — izinkan hanya origin dev Vite
$allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? '';

// ------- GET /api/auth.php?action=me -------
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'me') {
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['success' => false, 'message' => 'Belum login.', 'data' => null], 401);
    }
    jsonResponse([
        'success' => true,
        'message' => 'OK',
        'data'    => [
            'id'         => $_SESSION['user_id'],
            'username'   => $_SESSION['username'],
            'csrf_token' => generateCsrfToken(),
        ],
    ]);
}

// ------- POST /api/auth.php?action=login -------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    $username = trim($body['username'] ?? '');
    $password = $body['password'] ?? '';

    if (empty($username) || empty($password)) {
        jsonResponse(['success' => false, 'message' => 'Username dan password wajib diisi.', 'data' => null], 422);
    }

    $stmt = $conn->prepare("SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user   = $result->fetch_assoc();

    // Pesan error generik — tidak bocorkan info spesifik
    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Username atau password salah.', 'data' => null], 401);
    }

    // Buat sesi baru (hindari session fixation)
    session_regenerate_id(true);
    $_SESSION['user_id']  = $user['id'];
    $_SESSION['username'] = $user['username'];

    $csrfToken = generateCsrfToken();

    jsonResponse([
        'success' => true,
        'message' => 'Login berhasil.',
        'data'    => [
            'id'         => $user['id'],
            'username'   => $user['username'],
            'csrf_token' => $csrfToken,
        ],
    ]);
}

// ------- POST /api/auth.php?action=logout -------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'logout') {
    session_destroy();
    jsonResponse(['success' => true, 'message' => 'Logout berhasil.', 'data' => null]);
}

jsonResponse(['success' => false, 'message' => 'Action tidak dikenali.', 'data' => null], 400);
