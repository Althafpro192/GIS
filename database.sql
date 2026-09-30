CREATE DATABASE IF NOT EXISTS jember_db;
USE jember_db;

CREATE TABLE IF NOT EXISTS data_kecamatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_kecamatan VARCHAR(10) NOT NULL UNIQUE,
    nama_kecamatan VARCHAR(100) NOT NULL,
    jumlah_penduduk INT NOT NULL,
    luas_wilayah DECIMAL(10,2) NOT NULL,
    jumlah_faskes INT NOT NULL,
    jumlah_rentan INT NOT NULL
);

-- Data awal sampel BPS Kabupaten Jember
INSERT INTO data_kecamatan (kode_kecamatan, nama_kecamatan, jumlah_penduduk, luas_wilayah, jumlah_faskes, jumlah_rentan) VALUES
('3509010', 'Kencong', 72100, 68.30, 5, 4200),
('3509020', 'Gumukmas', 85400, 92.60, 6, 5100),
('3509030', 'Puger', 121000, 162.70, 8, 7300),
('3509040', 'Ambulu', 115200, 116.60, 9, 6800),
('3509120', 'Sumbersari', 132500, 37.00, 14, 3100),
('3509130', 'Kaliwates', 125800, 25.80, 16, 2800),
('3509140', 'Patrang', 102300, 37.10, 11, 2900);