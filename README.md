# 🚔 Portal Regulasi Kepolisian Futuristik

> Sistem manajemen regulasi, laporan, dan denda kepolisian berbasis teknologi digital futuristik untuk kebutuhan *Roleplay* (RP) — dibangun dengan React 19, TypeScript, dan desain cyberpunk immersive.

<div align="center">

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-pink)
![License](https://img.shields.io/badge/license-MIT-green)

**Status:** ✅ Production Ready | 🚀 Deployed via Vercel | 🔄 Versi Terbaru: 2026-06-25

</div>

---

## 📋 Daftar Fitur Lengkap

### 🗂️ Fitur Inti (Core Functionality)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| **Dashboard Admin** | ✅ | Analytics & manajemen regulasi, terlindungi password |
| **Browser Regulasi** | ✅ | Telusuri, cari, filter pasal + kalkulator denda |
| **Laporan Insiden** | ✅ | Buat laporan otomatis dengan deteksi pelanggar ulang (*residivis*) |
| **Dokumentasi** | ✅ | Panduan alur kerja berbasis skenario RP |
| **Sinkronisasi Real-time** | ✅ | Supabase PostgreSQL untuk kolaborasi multi-pengguna |
| **Mesin Penyesuaian Harga** | ✅ | Ubah semua denda secara massal (0% reset base, tombol pintasan cepat) |

---

### ⚡ Performa & Optimasi (Performance)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| **Adaptive Performance** | ✅ | Deteksi otomatis RAM, CPU, dan koneksi jaringan |
| **Service Worker PWA** | ✅ | Cache offline cerdas + deteksi pembaruan otomatis |
| **Lazy Loading Modul** | ✅ | Tab hanya dimuat saat diklik untuk menghemat RAM |
| **Video Kualitas Adaptif** | ✅ | Latar video menyesuaikan kemampuan perangkat (LOW/MED/HIGH) |
| **Animasi GPU-Accelerated** | ✅ | Hanya menggunakan `transform` & `opacity` untuk mencegah *layout reflow* |
| **Ambient Glow Dinonaktifkan** | ✅ | Dekorasi dinonaktifkan otomatis di perangkat low-end |
| **CSS Radial-gradient** | ✅ | Menggantikan efek `blur-3xl` yang berat CPU dengan gradient GPU-native |

---

### 🎨 Tampilan & Pengalaman Pengguna (UI/UX)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| **Desain Cyberpunk Immersive** | ✅ | Efek neon, glassmorphism, scanline, dan glitch futuristik |
| **Latar Video Futuristik** | ✅ | Video latar polisi RP yang menyesuaikan kualitas perangkat |
| **Desktop Floating Dock** | ✅ | Menu navigasi mengambang elegan (gaya macOS/iPad) di bagian bawah layar |
| **Mobile Bottom Bar** | ✅ | Navigasi bawah kompak untuk HP dengan indikator tab aktif animasi |
| **Framer Motion Sliding** | ✅ | Transisi tab aktif mengalir halus menggunakan `layoutId` spring physics |
| **Haptic Feedback** | ✅ | Getaran taktil native Android untuk klik, toast, dan konfirmasi |
| **Skeleton Loader Futuristik** | ✅ | Animasi "DECRYPTING MODULE..." pengganti layar *blank* saat memuat |
| **PWA Update Prompt** | ✅ | Notifikasi otomatis saat versi baru tersedia via `window.confirm` |
| **Glitch Title Effect** | ✅ | Efek glitch animasi pada judul landing page (GPU-optimized) |
| **Shimmer Effect** | ✅ | Efek holografis berkilau pada panel dashboard |
| **Efek Float Dekoratif** | ✅ | Orb ambient melayang lambat di latar belakang (dinonaktifkan di low-end) |

---

### 🔔 Sistem Notifikasi Toast

| Jenis Toast | Ikon | Warna | Keterangan |
|-------------|------|-------|------------|
| `success` | ✅ CheckCircle | Hijau Neon | Operasi berhasil (tambah/edit pasal, dsb.) |
| `warning` | ⚠️ Triangle | Oranye Neon | Penghapusan data |
| `error` | 🔴 Triangle | Merah Neon | Kesalahan sistem |
| `info` | ℹ️ Info | Biru Cyan | Informasi umum |
| `system` | 🖥️ Cpu | Cyan Override | **Khusus sistem** — penyesuaian inflasi & override sistem |

**Toast `system`** memiliki desain unik:
- Background solid gelap (`bg-slate-950/80`) + border cyan (`border-cyan-500/50`)
- Bayangan neon berpendar (`shadow-[0_0_15px_rgba(6,182,212,0.25)]`)
- Efek shimmer holografis mengalir di latar belakang
- Teks menggunakan font `monospace` dengan *letter-spacing* lebar
- Haptic feedback: pola getaran ganda cepat + denyutan panjang (`[40, 45, 40, 45, 90]`)

**Contoh pesan toast inflasi:**
```
[⚡ SYSTEM OVERRIDE] PROTOKOL INFLASI AKTIF: MATRIX NOMINAL DENDA DISINKRONISASI KE BASE +50% [STATUS: ONLINE]
[🔄 SYSTEM OVERRIDE] RESTORASI EKONOMI: SELURUH NOMINAL DENDA DIKEMBALIKAN KE HARGA DASAR (BASE LEVEL) [STATUS: NORMAL]
```

---

### 📋 Fitur Salin Laporan ASCII (Discord/Server Log)

Petugas RP dapat menyalin laporan tilang atau kriminal dalam format ASCII rapi untuk ditempelkan ke log Discord server.

**Tombol Akses:**
- Ikon 📋 hijau langsung pada **setiap kartu laporan** (tanpa buka detail)
- Tombol **"SALIN ASCII"** di dalam **modal detail invoice**

**Format Dinamis Berdasarkan Kategori:**

| Jenis Laporan | Judul Header | Label Pelaku |
|---------------|-------------|--------------|
| Lalu Lintas | `🚔  LAPORAN TILANG KOTA  🚔` | `Pelanggar:` |
| Kriminal | `🚔  LAPORAN KRIMINAL KOTA  🚔` | `Tersangka:` |

**Contoh Hasil Salinan Discord:**
````
```text
===========================================
        🚔  LAPORAN TILANG KOTA  🚔        
===========================================
ID: REP-17182902
Waktu: Kamis, 25 Jun 2026, 10:15
-------------------------------------------
Pelanggar: John Doe
Kategori: Lalu Lintas
-------------------------------------------
Rincian Pasal:
• [SL-11] Melanggar Batas Kecepatan
• [SL-03] Tidak Menggunakan Helm
-------------------------------------------
Total Denda: Rp 1.500.000
Kurungan: 2 Bulan
-------------------------------------------
     DEPARTEMEN KEPOLISIAN FUTURISTIK      
===========================================
```
````

> **Catatan:** Teks "inflasi" tidak ditampilkan dalam salinan — nominal denda sudah mencerminkan harga terbaru yang berlaku.

---

## 🏗️ Arsitektur Sistem

```
Portal Regulasi Kepolisian (React 19 + TypeScript)
├── src/
│   ├── App.tsx                         ← Root app, state management, toast system
│   ├── index.css                       ← Design system, animations, performance CSS
│   ├── types.ts                        ← TypeScript types (Regulation, IncidentReport)
│   ├── data.ts                         ← Initial seed data pasal regulasi
│   ├── main.tsx                        ← Entry point + AdaptivePerformance provider
│   ├── components/
│   │   ├── DashboardView.tsx           ← Analytics, grafik, manajemen pasal, inflasi
│   │   ├── RegulationView.tsx          ← Pencarian pasal + kalkulator denda
│   │   ├── ReportView.tsx              ← Riwayat laporan + fitur salin ASCII
│   │   ├── DocumentationView.tsx       ← Panduan & dokumentasi alur RP
│   │   ├── Toast.tsx                   ← Sistem notifikasi (5 tipe: success/warning/error/info/system)
│   │   ├── VideoBackground.tsx         ← Latar video adaptif kualitas
│   │   └── Logo.tsx                    ← Logo animasi dengan efek glow
│   ├── contexts/
│   │   └── AdaptivePerformanceContext.tsx ← Deteksi perangkat & konfigurasi tier
│   ├── hooks/                          ← Custom hooks
│   └── lib/
│       ├── database.ts                 ← Supabase CRUD + batch operations
│       └── serviceWorker.ts            ← Registrasi & manajemen PWA
├── public/
│   └── sw.js                           ← Service Worker (cache, update detection)
├── index.html                          ← Preload font, PWA meta
└── vercel.json                         ← SPA routing config
```

---

## 🔄 Riwayat Pembaruan (Changelog)

### v1.2.0 — 2026-06-25 *(Terbaru)*

#### 📱 Android-First Improvements
- **[BARU]** **Undo Hapus Laporan** — Klik hapus menampilkan toast `BATAL` selama 5 detik, pencegah salah klik di HP
- **[BARU]** **Badge Counter di Nav** — Angka merah pada ikon Laporan menampilkan jumlah laporan yang dibuat hari ini (real-time)
- **[FIX]** **Tombol Back Android** — Menggunakan History API (`pushState`/`popstate`) agar back kembali ke tab sebelumnya, bukan keluar browser

#### 🔔 Notifikasi Interaktif
- **[BARU]** Toast kini mendukung **tombol aksi inline** (contoh: tombol `BATAL` berwarna sesuai tipe toast)
- **[PENINGKATAN]** Progress bar toast dengan warna dinamis per tipe notifikasi

#### 🔍 UX Laporan
- **[BARU]** Pencarian real-time di tab Laporan — cari nama, ID, atau kode pasal
- **[BARU]** Pull-to-refresh — tarik layar untuk sinkronisasi ulang data dari Supabase

---

### v1.1.0 — 2026-06-25

#### 🎯 Toast Notifikasi Bertema Sci-Fi
- **[BARU]** Tipe toast `system` dengan desain cyberpunk unik (shimmer, neon glow, font mono)
- **[BARU]** Pesan penyesuaian inflasi berubah menjadi "SYSTEM OVERRIDE" berbahasa teknis futuristik
- **[BARU]** Haptic feedback khusus untuk toast system: `[40, 45, 40, 45, 90]` (dua blip cepat + denyut panjang)
- **[PENINGKATAN]** Semua toast standar kini memiliki pendar neon halus sesuai warnanya

#### 📋 Fitur Salin Laporan ASCII (Discord-Ready)
- **[BARU]** Tombol salin ikon hijau langsung di setiap kartu laporan
- **[BARU]** Tombol "SALIN ASCII" di modal detail invoice
- **[BARU]** Format ASCII kotak telex militer kompatibel Discord (blok kode ` ```text ``` `)
- **[BARU]** Header & label dinamis: `TILANG KOTA` vs `KRIMINAL KOTA`, `Pelanggar` vs `Tersangka`
- **[PENINGKATAN]** Clipboard fallback menggunakan toast sukses, bukan `alert()` browser

---

### v1.0.1 — 2026-06-24

#### 🏎️ Performa & Arsitektur
- **[BARU]** `AdaptivePerformanceContext` — deteksi otomatis RAM/CPU/jaringan, pembagian tier HIGH/MED/LOW
- **[BARU]** Ambient glow menggunakan CSS `radial-gradient` (menggantikan `blur-3xl` yang berat CPU)
- **[BARU]** `lazyWithRetry()` — chunk JS di-retry otomatis saat gagal dimuat (misal karena cache lama)
- **[PERBAIKAN]** Input inflasi `"0"` sebelumnya tidak bisa diklik tombol "Terapkan" — sudah diperbaiki

#### 🧭 Navigasi Kelas Atas
- **[BARU]** **Desktop Floating Dock** — navigasi mengambang di bawah layar menggantikan sidebar
- **[BARU]** **Mobile Bottom Bar** kompak dengan indikator `layoutId` spring animation
- **[PENINGKATAN]** Navigasi tidak lagi memakan ruang konten utama di layar laptop

#### ⚙️ PWA & Service Worker
- **[BARU]** Deteksi pembaruan versi otomatis oleh Service Worker
- **[BARU]** Pop-up notifikasi "VERSI SISTEM BARU TERSEDIA!" saat update terdeteksi di latar belakang
- **[BARU]** Skeleton Loader "DECRYPTING MODULE..." saat modul tab di-lazy-load

#### 🎭 Immersive Effects
- **[BARU]** Glitch title animation di halaman landing (GPU-optimized, dinonaktifkan di low-end)
- **[PENINGKATAN]** Efek float dekoratif menggunakan CSS animation (bukan JS)
- **[PENINGKATAN]** Semua animasi menggunakan `will-change` dan `transform: translateZ(0)` untuk kompositing GPU

---

### v1.0.0 — 2026-06-23 *(Rilis Awal)*
- Sistem manajemen regulasi (CRUD pasal)
- Kalkulator denda + laporan insiden
- Sinkronisasi Supabase real-time
- Deteksi residivis lalu lintas
- Web Share API + cetak invoice
- Desain futuristik dasar

---

## 🚀 Quick Start

### Prasyarat
- Node.js 18+
- npm

### Instalasi

```bash
# Clone atau unduh repositori
cd portal-regulasi-kepolisian-futuristik

# Install dependensi
npm install

# Salin template environment
cp .env.example .env
# Edit .env dengan kredensial Supabase dan password dashboard
```

### Mode Pengembangan

```bash
# Jalankan dev server (http://localhost:5173)
npm run dev

# Build produksi
npm run build

# Preview build produksi
npm run preview
```

---

## 📊 Metrik Performa Bundle

### Bundle Size (Gzip)

| Aset | Ukuran | Cache |
|------|--------|-------|
| HTML | 0.86 KB | No-cache |
| CSS | 12.37 KB | 1 Tahun |
| Main JS | 82.83 KB | 1 Tahun |
| DashboardView | 6.60 KB | 1 Tahun |
| ReportView | 4.12 KB | 1 Tahun |
| RegulationView | 4.46 KB | 1 Tahun |
| Supabase | 54.63 KB | 1 Tahun |
| Framer Motion | 31.35 KB | 1 Tahun |
| **Total Initial Load** | **~180 KB** | ✅ |

### Tier Perangkat

| Tier | Perangkat | RAM | CPU | Fitur |
|------|-----------|-----|-----|-------|
| **High-End** | Flagship modern | >4GB | >4 core | Semua efek aktif |
| **Mid-Range** | Android standar | 2–4GB | 2–4 core | Efek dikurangi |
| **Low-End** | HP budget | <2GB | <2 core | Efek minimal, video off |

### Estimasi Load Time
- High-end WiFi: ~800ms
- Mid-range 4G: ~1.2s
- Low-end 3G: ~2.5s (video lazy-load)
- Offline (cached): ~300ms

---

## 🔧 Konfigurasi

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Password Dashboard Admin
VITE_DASHBOARD_PASSWORD=ADMIN2026
```

### Deteksi Perangkat Otomatis

Sistem mendeteksi kemampuan perangkat berdasarkan:
- `navigator.deviceMemory` — RAM dalam GB
- `navigator.hardwareConcurrency` — Jumlah core CPU
- `navigator.connection.effectiveType` — Tipe jaringan (`3g`/`4g`/`slow-4g`)

---

## 📱 Dukungan Perangkat

| Perangkat | Browser | Status | Catatan |
|-----------|---------|--------|---------|
| iPhone 12+ | Safari | ✅ Penuh | Semua fitur |
| iPhone SE | Safari | ✅ Penuh | Animasi dikurangi |
| Samsung Galaxy A | Chrome | ✅ Penuh | Semua fitur |
| HP Budget Android | Chrome | ✅ Penuh | Video off, efek minimal |
| Desktop (Laptop) | Chrome/Firefox/Edge | ✅ Penuh | Floating Dock aktif |
| Tablet | Safari/Chrome | ✅ Penuh | Layout responsif |

---

## 🌐 Deployment (Vercel)

```bash
# 1. Set environment variables di panel Vercel:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
#    - VITE_DASHBOARD_PASSWORD

# 2. Push ke GitHub (Vercel auto-deploy dari branch main)
git push origin main
```

Konfigurasi SPA routing sudah tersedia di `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🛠️ Tech Stack

| Lapisan | Teknologi | Versi |
|---------|-----------|-------|
| **Framework** | React | 19 |
| **Bahasa** | TypeScript | 5.8 |
| **Build Tool** | Vite | 6 |
| **Styling** | Tailwind CSS | v4 |
| **Database** | Supabase (PostgreSQL) | — |
| **Animasi** | Framer Motion | 12 |
| **Ikon** | Lucide React | — |
| **Hosting** | Vercel | — |
| **PWA** | Service Worker (Custom) | — |

---

## 🔐 Keamanan

- ✅ Dashboard terlindungi password (dapat dikonfigurasi via env)
- ✅ Session dashboard kadaluarsa otomatis setelah 24 jam
- ✅ Semua rahasia disimpan via environment variables
- ✅ Supabase RLS (Row Level Security) diaktifkan
- ✅ HTTPS enforced via Vercel
- ✅ Tidak ada data sensitif di logs browser

---

## 📖 Dokumentasi Tambahan

| File | Isi |
|------|-----|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Panduan deployment lengkap |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Verifikasi pra-deploy |
| [supabase-schema.sql](./supabase-schema.sql) | Skema database |
| [.env.example](./.env.example) | Template variabel environment |

---

## 👤 Author

**Fanzy AKA. Fajuu**
- Role: Developer & Designer
- Platform: Futuristic Roleplay City

---

## ✨ Credits

- Video background: Futuristic Roleplay
- Ikon: Lucide React
- Animasi: Framer Motion
- Inspirasi desain: Cyberpunk, Glassmorphism, JARVIS (Iron Man)

---

<div align="center">

**Status:** ✅ Production Ready | 🚀 Auto-deployed via Vercel

*Last Updated: 25 Juni 2026 — v1.1.0*

</div>
