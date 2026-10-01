<?php
// Redirect otomatis ke aplikasi React modern (Vite dev server)
header("Location: http://localhost:5173/");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web GIS Jember - Redirection</title>
    <meta http-equiv="refresh" content="0;url=http://localhost:5173/">
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #09090b;
            color: #f4f4f5;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            max-width: 480px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 12px; color: #38bdf8; }
        p { color: #a1a1aa; font-size: 0.95rem; margin-bottom: 24px; line-height: 1.5; }
        a.btn {
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.9rem;
            transition: background 0.2s;
        }
        a.btn:hover { background: #1d4ed8; }
        code {
            background: #27272a;
            color: #38bdf8;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Mengarahkan ke Aplikasi React GIS...</h1>
        <p>Aplikasi GIS Penduduk Jember telah diperbarui ke <strong>React + Vite</strong>.</p>
        <p>Jika tidak terarah otomatis, buka link utama di bawah ini atau pastikan server <code>cd frontend && npm run dev</code> sedang berjalan.</p>
        <a href="http://localhost:5173/" class="btn">Buka Web GIS (http://localhost:5173)</a>
    </div>
</body>
</html>
