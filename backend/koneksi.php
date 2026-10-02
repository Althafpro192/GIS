<?php
// Koneksi database MySQL — digunakan oleh seluruh API.
// Support environment variables untuk Docker deployment
$host = getenv('DB_HOST') ?: 'db';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: 'tefa2025bisa';
$db   = getenv('DB_NAME') ?: 'jember_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        "success"  => false,
        "message"  => "Koneksi database gagal.",
        "data"     => null
    ]));
}

$conn->set_charset("utf8mb4");
?>
