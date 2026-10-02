# Data Penduduk Kabupaten Jember 2024

Aplikasi visualisasi data kependudukan 31 kecamatan Kabupaten Jember berbasis **React + Vite** (frontend) dan **PHP + MySQL** (backend).

## Fitur

- **Peta choropleth interaktif** (Leaflet) — mode jumlah penduduk & laju pertumbuhan
- **Grafik horizontal bar** (Chart.js) — perbandingan antar kecamatan
- **Tabel data** — search, sort kolom, pagination client-side
- **Panel admin** — CRUD kecamatan dengan autentikasi session PHP
- **Dark mode** — toggle, preferensi disimpan di localStorage

## Struktur Proyek

```
GIS/
├── backend/
│   ├── koneksi.php
│   ├── database.sql
│   ├── jember_kecamatan.geojson
│   └── api/
│       ├── auth.php
│       ├── kecamatan.php
│       └── _middleware.php
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx / App.jsx / index.css
│       ├── lib/          (api.js, utils.js)
│       ├── stores/       (authStore.js)
│       ├── hooks/        (useKecamatan.js, useGeojson.js)
│       ├── components/   (ui/, layout/, map/, chart/, table/)
│       ├── pages/        (HomePage, LoginPage, admin/*)
│       └── routes/       (ProtectedRoute.jsx)
└── README.md
```

## Prasyarat

- **XAMPP** (PHP 8.1+, MySQL 8+, Apache)
- **Node.js** 18+ dan npm

---

## Langkah Setup

### 1. Database

1. Buka XAMPP, aktifkan **Apache** dan **MySQL**.
2. Buka phpMyAdmin (`http://localhost/phpmyadmin`).
3. Import file `backend/database.sql` (akan membuat database `jember_db` beserta tabel dan data awal).

> **Akun admin default:** username `admin` | password `Admin123!`

### 2. Backend PHP

File backend sudah siap di folder `backend/`. Tidak perlu konfigurasi tambahan jika menggunakan XAMPP default (root:""  database).

Jika kredensial MySQL berbeda, edit `backend/koneksi.php`:
```php
$user = "root";
$pass = "";   // ganti sesuai password MySQL Anda
```

### 3. Frontend React

```bash
# Masuk ke folder frontend
cd frontend

# Salin file environment
cp .env.example .env

# Install dependensi
npm install

# Jalankan dev server
npm run dev
```

Akses di: **http://localhost:5173**

### 4. Environment Variables

Edit `frontend/.env` sesuai path XAMPP Anda:

```env
VITE_API_URL=http://localhost/GIS/backend/api
VITE_GEOJSON_URL=http://localhost/GIS/backend/jember_kecamatan.geojson
```

---

## Penggunaan

| URL | Deskripsi |
|-----|-----------|
| `http://localhost:5173/` | Halaman publik — peta, grafik, tabel |
| `http://localhost:5173/login` | Login admin |
| `http://localhost:5173/admin` | Dashboard admin |
| `http://localhost:5173/admin/kecamatan` | Daftar & kelola kecamatan |

---

## Stack Teknologi

**Frontend:** Vite + React 18, Tailwind CSS v3, React Router v6, react-leaflet, Chart.js, Axios, Zustand, react-hook-form + Zod, lucide-react

**Backend:** PHP 8+, MySQL 8, Session-based auth, CSRF protection

---

## Catatan Keamanan

- Password di-hash dengan `PASSWORD_BCRYPT` (PHP `password_hash`)
- Semua query menggunakan prepared statements
- CSRF token di-generate server dan dikirim di header `X-CSRF-Token`
- Session cookie tidak diekspos ke JavaScript (`httpOnly` via PHP session)
- Error message server tidak membocorkan informasi sensitif

---

## 🐳 Deployment dengan Docker (Dokploy)

### Prasyarat

- Docker Engine 20.10+
- Docker Compose v2.0+
- Git

### Struktur Docker Files

```
GIS/
├── Dockerfile              # PHP-FPM Backend
├── docker-compose.yml     # Development
├── docker-compose.prod.yml # Production (Dokploy)
├── .dockerignore
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
└── backend/
```

### Development (Local)

```bash
# Build dan run semua services
docker-compose up -d --build

# Lihat logs
docker-compose logs -f

# Stop services
docker-compose down
```

Aplikasi dapat diakses di: **http://localhost**

### Production (Dokploy)

1. **Push ke Git Repository**
   ```bash
   git add .
   git commit -m "Add Docker configuration for Dokploy"
   git push origin main
   ```

2. **Setup di Dokploy**
   - Buka Dokploy Dashboard
   - Buat **Project** baru
   - Buat **Server** (vPS/Docker host)
   - Buat **Compose** deployment
   
3. **Konfigurasi Environment Variables**
   Tambahkan environment variables di Dokploy:
   ```
   DB_HOST=db
   DB_USER=root
   DB_PASSWORD=tefa2025bisa
   DB_NAME=jember_db
   ```

4. **Deploy**
   - Pilih repository
   - Pilih branch (main/master)
   - Dokploy akan auto-build dan deploy menggunakan `docker-compose.prod.yml`

### Services

| Service | Port | Deskripsi |
|---------|------|-----------|
| `frontend` | 80, 443 | Nginx + React static files |
| `backend` | 9000 | PHP-FPM |
| `db` | 3306 | MySQL 8.0 |

### Troubleshooting

**Container tidak start:**
```bash
# Cek logs
docker-compose logs backend
docker-compose logs db

# Rebuild tanpa cache
docker-compose build --no-cache
```

**Database connection error:**
- Pastikan service `db` sudah healthy
- Cek environment variables
- Tunggu sampai MySQL fully initialized

**Frontend 502/504 error:**
- Pastikan PHP-FPM container running
- Cek nginx configuration

### Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| Admin Panel | `admin` | `Admin123!` |
| MySQL Root | `root` | `tefa2025bisa` |

---

## 📁 Struktur File Docker

### Dockerfile (Backend)
```dockerfile
FROM php:8.2-fpm
# Install extensions: pdo_mysql, mbstring, gd, zip
# Copy backend files
# Expose port 9000
```

### frontend/Dockerfile
```dockerfile
# Build stage: Node 18 + Vite build
# Production stage: Nginx Alpine
# Copy nginx.conf for routing
```

### docker-compose.yml
```yaml
services:
  db:      mysql:8.0
  backend: php:8.2-fpm
  frontend: nginx:alpine
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `db` | MySQL host |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | `tefa2025bisa` | MySQL password |
| `DB_NAME` | `jember_db` | Database name |
