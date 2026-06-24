import React, { useState, useMemo } from 'react';
import {
  BookOpen, ShieldAlert, ClipboardList, FileText, LayoutDashboard,
  Search, ChevronDown, ChevronRight, AlertTriangle, CheckCircle,
  Info, Zap, Lock, Eye, MousePointer, Keyboard, ArrowRight,
  Monitor, Smartphone, Trash2, Edit2, Plus, Printer, RefreshCw, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DocSection = 'overview' | 'auth' | 'regulasi' | 'kalkulator' | 'laporan' | 'dashboard' | 'tips' | 'faq';

interface DocItem {
  title: string;
  desc: string;
  badge?: { text: string; color: string };
  steps?: string[];
  tips?: string[];
}

interface DocGroup {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: DocItem[];
}

const sections: { id: DocSection; icon: React.ReactNode; label: string }[] = [
  { id: 'overview', icon: <ShieldAlert className="w-4 h-4" />, label: 'Ringkasan' },
  { id: 'auth', icon: <Lock className="w-4 h-4" />, label: 'Login & Akses' },
  { id: 'regulasi', icon: <BookOpen className="w-4 h-4" />, label: 'Menu Regulasi' },
  { id: 'kalkulator', icon: <ClipboardList className="w-4 h-4" />, label: 'Kalkulator' },
  { id: 'laporan', icon: <FileText className="w-4 h-4" />, label: 'Menu Laporan' },
  { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { id: 'tips', icon: <Zap className="w-4 h-4" />, label: 'Tips & Trik' },
  { id: 'faq', icon: <HelpCircle className="w-4 h-4" />, label: 'FAQ' },
];

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
    </svg>
  );
}

const docContent: Record<DocSection, DocGroup[]> = {
  overview: [
    {
      title: 'Tentang Portal Ini',
      icon: <Info className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Apa itu Portal Regulasi Kepolisian?',
          desc: 'Portal ini adalah sistem manajemen pelanggaran untuk keperluan Roleplay. Portal membantu petugas dalam mengelola pasal undang-undang, menghitung denda & hukuman, serta membuat laporan pelanggaran secara digital.',
        },
        {
          title: 'Siapa yang Boleh Menggunakan?',
          desc: 'Portal dikhususkan untuk anggota kepolisian dalam Roleplay. Siapapun bisa langsung mengakses portal tanpa perlu login. Menu Dashboard memiliki proteksi password tambahan untuk pengelola data.',
        },
        {
          title: 'Data Tersimpan Aman',
          desc: 'Semua data pasal dan laporan tersimpan secara online dan tersinkron secara real-time antar perangkat. Jika satu anggota input laporan, anggota lain langsung melihatnya. Jika internet putus, portal tetap bisa digunakan dengan mode offline.',
        },
      ],
    },
    {
      title: '4 Menu Utama',
      icon: <Monitor className="w-4 h-4" />,
      color: 'emerald',
      items: [
        {
          title: 'Dashboard (Terproteksi Password)',
          desc: 'Panel admin untuk mengelola data regulasi. Berisi grafik statistik, tabel pasal, dan fitur penyesuaian harga inflasi.',
          badge: { text: 'Perlu Password', color: 'amber' },
        },
        {
          title: 'Regulasi (Browse & Pilih Pasal)',
          desc: 'Halaman utama untuk browsing semua pasal undang-undang. Bisa filter per kategori, cari berdasarkan kode atau deskripsi, lalu tambahkan pasal ke kalkulator untuk dihitung dendanya.',
          badge: { text: 'Menu Utama', color: 'cyan' },
        },
        {
          title: 'Kalkulator (Hitung Denda)',
          desc: 'Panel di samping daftar regulasi yang menampilkan total denda & kurungan dari pasal yang dipilih. Setelah yakin, bisa konfirmasi dan otomatis buat laporan.',
          badge: { text: 'Otomatis', color: 'emerald' },
        },
        {
          title: 'Laporan (Riwayat Pelanggaran)',
          desc: 'Menampilkan semua laporan yang sudah dibuat, dipisah menjadi 2 tab: Kriminal dan Lalu Lintas. Bisa lihat invoice detail dan cetak surat tilang.',
          badge: { text: '2 Tab', color: 'blue' },
        },
      ],
    },
    {
      title: 'Workflow Singkat',
      icon: <ArrowRight className="w-4 h-4" />,
      color: 'emerald',
      items: [
        {
          title: 'Cara Kerja Portal (3 Langkah)',
          desc: 'Portal bekerja dalam 3 langkah sederhana:',
          steps: [
            '1. Pilih pasal yang sesuai di menu Regulasi',
            '2. Hitung total denda di Kalkulator, lalu konfirmasi',
            '3. Laporan otomatis tersimpan di menu Laporan',
          ],
        },
      ],
    },
  ],
  auth: [
    {
      title: 'Akses Portal',
      icon: <Lock className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Masuk ke Portal',
          desc: 'Saat pertama kali membuka portal, kamu langsung masuk ke halaman utama. Tidak perlu login atau password untuk mengakses menu Regulasi, Kalkulator, dan Laporan.',
          badge: { text: 'Langsung Akses', color: 'emerald' },
        },
        {
          title: 'Akses Dashboard (Password Khusus)',
          desc: 'Menu Dashboard membutuhkan password tambahan karena berisi pengaturan data regulasi.',
          steps: [
            'Klik tab "Dashboard" di sidebar',
            'Modal password akan muncul',
            'Masukkan password admin',
            'Klik "UNLOCK"',
            'Password tersimpan 24 jam (tidak perlu masuk ulang)',
          ],
          badge: { text: 'Proteksi', color: 'amber' },
        },
      ],
    },
  ],
  regulasi: [
    {
      title: 'Melihat & Mencari Pasal',
      icon: <Eye className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Daftar Semua Pasal',
          desc: 'Semua pasal undang-undang ditampilkan dalam daftar yang bisa di-scroll. Setiap pasal menampilkan kode, deskripsi, denda, dan waktu kurungan.',
        },
        {
          title: 'Mencari Pasal',
          desc: 'Gunakan kolom pencarian di atas daftar. Bisa mencari berdasarkan kode pasal (contoh: "SL-01") atau kata kunci deskripsi (contoh: "helm").',
          steps: [
            'Klik kolom pencarian',
            'Ketik kode pasal atau kata kunci',
            'Daftar akan otomatis filter secara real-time',
            'Kosongkan kolom untuk menampilkan semua pasal',
          ],
        },
        {
          title: 'Filter per Kategori',
          desc: 'Klik salah satu kartu kategori untuk memfilter pasal:',
          tips: [
            'SatLantas (SL) — Pelanggaran lalu lintas — Warna Cyan',
            'Ringan (PR) — Tindak pidana ringan — Warna Hijau',
            'Menengah (PM) — Tindak pidana menengah — Warna Kuning',
            'Berat (PB) — Tindak pidana berat — Warna Merah',
            'Klik lagi untuk menghapus filter',
          ],
        },
      ],
    },
    {
      title: 'Kode Pasal',
      icon: <Zap className="w-4 h-4" />,
      color: 'amber',
      items: [
        {
          title: 'Format Kode Pasal',
          desc: 'Setiap pasal punya kode unik yang terdiri dari prefix kategori + nomor urut:',
          tips: [
            'SL-01 s/d SL-10 — Pasal Lalu Lintas (10 pasal)',
            'PR-01 s/d PR-10 — Pasal Ringan (10 pasal)',
            'PM-01 s/d PM-10 — Pasal Menengah (10 pasal)',
            'PB-01 s/d PB-10 — Pasal Berat (10 pasal)',
            'Total: 40 pasal default (bisa ditambah via Dashboard)',
          ],
        },
        {
          title: 'Kategori dan Dampak',
          desc: 'Kategori menentukan bagaimana laporan diklasifikasikan:',
          tips: [
            'SatLantas → Laporan masuk tab "Lalu Lintas"',
            'Ringan/Menengah/Berat → Laporan masuk tab "Kriminal"',
            'Jika campur (misal: 1 SL + 1 PM), laporan masuk "Kriminal"',
          ],
        },
      ],
    },
  ],
  kalkulator: [
    {
      title: 'Menggunakan Kalkulator',
      icon: <ClipboardList className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Langkah-langkah',
          desc: 'Ikuti langkah berikut untuk menghitung denda dan membuat laporan:',
          steps: [
            'Buka tab "Regulasi" di sidebar',
            'Cari dan pilih pasal yang sesuai dengan pelanggaran',
            'Klik tombol "TAMBAH" pada pasal yang dipilih',
            'Ulangi sampai semua pasal terpilih',
            'Lihat panel Kalkulator di sebelah kanan',
            'Pastikan total denda dan kurungan sudah benar',
            'Klik "KONFIRMASI HITUNG"',
            'Masukkan nama tersangka/warga',
            'Klik "CATAT & KIRIM KE LAPORAN"',
            'Kamu akan otomatis dialihkan ke tab Laporan',
          ],
        },
        {
          title: 'Panel Kalkulator',
          desc: 'Panel kalkulator di sebelah kanan menampilkan:',
          tips: [
            'Total Denda — jumlah semua denda dari pasal yang dipilih',
            'Total Kurungan — jumlah semua waktu kurungan (Bulan)',
            'Daftar Pasal — list semua pasal yang sudah dipilih',
            'Tombol Hapus — hapus pasal dari daftar (ikon tempat sampah)',
          ],
        },
        {
          title: 'Reset Kalkulator',
          desc: 'Klik "RESET KALKULATOR" untuk menghapus semua pasal yang dipilih dan memulai dari awal. Berguna jika ingin mengubah pilihan pasal.',
        },
      ],
    },
    {
      title: 'Deteksi Residivis & Tilang Ulang',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'amber',
      items: [
        {
          title: 'Sistem Deteksi Otomatis',
          desc: 'Saat memasukkan nama tersangka di modal konfirmasi, sistem otomatis mengecek apakah nama tersebut pernah ada di laporan sebelumnya.',
          badge: { text: 'Fitur Penting', color: 'amber' },
        },
        {
          title: 'Untuk Pelanggaran Lalu Lintas',
          desc: 'Jika pasal yang dipilih SEMUANYA kategori SatLantas, sistem hanya mengecek riwayat pelanggaran lalu lintas.',
          tips: [
            'Jika warga pernah ditilang → muncul: "WARGA INI PERNAH DITILANG"',
            'Jumlah berapa kali ditilang',
            'Total denda yang pernah dibayar',
            'Pasal-pasal yang pernah dilanggar',
          ],
        },
        {
          title: 'Untuk Tindak Kriminal',
          desc: 'Jika ada minimal 1 pasal non-SatLantas, sistem mengecek riwayat tindak kriminal.',
          tips: [
            'Jika tersangka pernah ditangkap → muncul: "SUSPECT RESIDIVIS"',
            'Jumlah berapa kali ditangkap',
            'Total waktu penjara yang sudah dijalani',
            'Total denda yang pernah dibayar',
            'Pasal-pasal yang pernah dikenakan',
          ],
        },
      ],
    },
  ],
  laporan: [
    {
      title: 'Struktur Menu Laporan',
      icon: <FileText className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Dua Tab Kategori',
          desc: 'Menu Laporan memiliki 2 tab untuk memisahkan jenis pelanggaran:',
          tips: [
            'Tab "Kriminal" — laporan tindak kriminal (ringan/menengah/berat)',
            'Tab "Lalu Lintas" — pelanggaran lalu lintas (satlantas)',
            'Setiap tab menampilkan jumlah laporan',
          ],
        },
        {
          title: 'Isi Setiap Laporan',
          desc: 'Setiap kartu laporan menampilkan:',
          tips: [
            'ID Laporan (contoh: REP-1234567890)',
            'Tanggal & waktu pembuatan',
            'Nama tersangka/warga',
            'Daftar pasal yang dikenakan',
            'Total denda dan total kurungan',
            'Badge pelanggaran ulang (jika ada)',
          ],
        },
      ],
    },
    {
      title: 'Pelanggaran Ulang',
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'amber',
      items: [
        {
          title: 'Deteksi Pelanggaran Ulang (Lalu Lintas)',
          desc: 'Jika seorang warga sudah pernah melanggar lalu lintas sebelumnya, akan muncul badge peringatan di kartu laporannya.',
          badge: { text: 'Otomatis', color: 'amber' },
          tips: [
            'Badge "PELANGGARAN ULANG" berwarna kuning',
            'Jumlah pelanggaran ditampilkan',
            'Contoh: "Warga ini telah melanggar lalu lintas sebanyak 3 kali!"',
          ],
        },
        {
          title: 'Deteksi Residivis (Kriminal)',
          desc: 'Untuk laporan kriminal, sistem mendeteksi apakah tersangka pernah melakukan tindak kriminal sebelumnya.',
          tips: [
            'Badge "RESIDIVIS" berwarna kuning',
            'Total waktu penjara yang pernah dijalani',
            'Total denda yang pernah dibayar',
          ],
        },
      ],
    },
    {
      title: 'Invoice & Cetak',
      icon: <Printer className="w-4 h-4" />,
      color: 'emerald',
      items: [
        {
          title: 'Melihat Invoice Detail',
          desc: 'Klik ikon dokumen pada kartu laporan untuk melihat surat tilang detail.',
          steps: [
            'Klik ikon dokumen pada laporan',
            'Modal invoice akan terbuka',
            'Invoice berisi: nama terlapor, rincian pasal, total denda, total kurungan',
            'Klik "CETAK" untuk mencetak atau simpan sebagai PDF',
            'Klik "TUTUP" untuk menutup modal',
          ],
        },
        {
          title: 'Mencetak Surat Tilang',
          desc: 'Gunakan fitur cetak browser untuk mencetak surat tilang:',
          tips: [
            'Klik tombol "CETAK" di modal invoice',
            'Dialog cetak browser akan muncul',
            'Pilih printer atau "Save as PDF"',
            'Atur margin dan orientasi sesuai kebutuhan',
            'Klik "Print" atau "Save"',
          ],
        },
      ],
    },
    {
      title: 'Menghapus Laporan',
      icon: <Trash2 className="w-4 h-4" />,
      color: 'red',
      items: [
        {
          title: 'Cara Menghapus',
          desc: 'Klik ikon tempat sampah pada kartu laporan untuk menghapusnya.',
          tips: [
            'Konfirmasi akan muncul sebelum penghapusan',
            'Laporan yang dihapus tidak bisa dikembalikan',
            'Data langsung terhapus dari sistem',
          ],
          badge: { text: 'Permanen', color: 'red' },
        },
      ],
    },
  ],
  dashboard: [
    {
      title: 'Akses Dashboard',
      icon: <Lock className="w-4 h-4" />,
      color: 'amber',
      items: [
        {
          title: 'Password Dashboard',
          desc: 'Dashboard terproteksi password terpisah untuk menjaga keamanan data regulasi.',
          steps: [
            'Klik tab "Dashboard" di sidebar',
            'Masukkan password admin',
            'Password tersimpan 24 jam di browser',
            'Setelah 24 jam, harus masuk ulang',
          ],
          badge: { text: 'Proteksi', color: 'amber' },
        },
      ],
    },
    {
      title: 'Grafik Statistik',
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: '4 Kartu Statistik',
          desc: 'Di bagian atas dashboard, terdapat 4 kartu statistik:',
          tips: [
            'Total Pasal — jumlah semua pasal di sistem',
            'Total Laporan — jumlah semua laporan yang sudah dibuat',
            'Kriminal — jumlah laporan tindak kriminal',
            'Lalu Lintas — jumlah laporan pelanggaran lalu lintas',
          ],
        },
        {
          title: 'Grafik Donut (Pasal per Kategori)',
          desc: 'Grafik lingkaran yang menampilkan persentase pasal per kategori. Warna: Cyan (SatLantas), Hijau (Ringan), Kuning (Menengah), Merah (Berat).',
        },
        {
          title: 'Grafik Batang (Laporan per Hari)',
          desc: 'Grafik batang yang menampilkan jumlah laporan per hari dalam seminggu (Min-Sab). Data diambil langsung dari laporan yang ada di sistem.',
        },
      ],
    },
    {
      title: 'Penyesuaian Harga Inflasi',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'amber',
      items: [
        {
          title: 'Apa itu Fitur Inflasi?',
          desc: 'Fitur ini memungkinkan kamu menyesuaikan semua harga denda sekaligus berdasarkan persentase inflasi. Misalnya, jika inflasi naik 100%, semua denda akan digandakan.',
          badge: { text: 'Fitur Baru', color: 'amber' },
        },
        {
          title: 'Cara Menggunakan',
          desc: 'Ikuti langkah berikut untuk menyesuaikan harga denda:',
          steps: [
            'Buka menu Dashboard (masukkan password)',
            'Cari bagian "PENYESUAIAN HARGA INFLASI"',
            'Masukkan persentase kenaikan (contoh: 100 untuk +100%)',
            'Klik tombol "Terapkan"',
            'Konfirmasi perubahan',
            'Semua harga denda otomatis berubah',
          ],
        },
        {
          title: 'Tombol Cepat',
          desc: 'Terdapat tombol cepat untuk persentase umum:',
          tips: [
            '+10% — inflasi ringan',
            '+50% — inflasi menengah',
            '+100% — harga ganda (double)',
            '+200% — harga tiga kali lipat',
            '+300% — harga empat kali lipat',
          ],
        },
        {
          title: 'Yang Perlu Diketahui',
          desc: 'Beberapa hal penting tentang fitur inflasi:',
          tips: [
            'Perubahan berlaku untuk SEMUA pasal',
            'Harga dibulatkan ke angka terdekat',
            'Riwayat laporan yang sudah ada tidak berubah',
            'Hanya laporan baru yang menggunakan harga terbaru',
          ],
        },
      ],
    },
    {
      title: 'Manajemen Regulasi',
      icon: <Edit2 className="w-4 h-4" />,
      color: 'emerald',
      items: [
        {
          title: 'Melihat Semua Pasal',
          desc: 'Di bawah grafik, terdapat tabel yang menampilkan semua pasal. Bisa di-scroll horizontal di mobile.',
          tips: [
            'Kode Pasal — ditampilkan warna cyan',
            'Deskripsi — teks singkat pelanggaran',
            'Denda — dalam Rupiah',
            'Kurungan — dalam bulan',
            'Kategori — badge berwarna',
            'Aksi — tombol Edit dan Hapus',
          ],
        },
        {
          title: 'Menambah Pasal Baru',
          desc: 'Klik tombol "TAMBAH REGULASI BARU" di atas tabel.',
          steps: [
            'Klik tombol "TAMBAH REGULASI BARU"',
            'Isi Kode Pasal (harus unik, contoh: SL-11)',
            'Isi Deskripsi Singkat',
            'Isi Harga Denda (angka positif)',
            'Isi Kurungan (angka positif, 0 jika tidak ada)',
            'Pilih Kategori dari dropdown',
            'Klik "SIMPAN"',
            'Pasal baru langsung muncul di tabel dan menu Regulasi',
          ],
        },
        {
          title: 'Mengedit Pasal',
          desc: 'Klik ikon pensil pada baris pasal yang ingin diedit.',
          steps: [
            'Klik ikon pensil pada baris pasal',
            'Form edit akan muncul dengan data lama',
            'Ubah field yang diperlukan',
            'Kode Pasal tidak bisa diubah saat edit',
            'Klik "SIMPAN"',
            'Perubahan langsung terlihat di semua menu',
          ],
        },
        {
          title: 'Menghapus Pasal',
          desc: 'Klik ikon tempat sampah pada baris pasal.',
          tips: [
            'Konfirmasi akan muncul sebelum penghapusan',
            'Pasal yang dihapus juga hilang dari kalkulator',
            'Tidak bisa dikembalikan',
          ],
          badge: { text: 'Permanen', color: 'red' },
        },
      ],
    },
  ],
  tips: [
    {
      title: 'Tips Penggunaan',
      icon: <Zap className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Workflow Cepat: Tilang Lalu Lintas',
          desc: 'Cara tercepat untuk membuat tilang lalu lintas:',
          steps: [
            'Buka tab "Regulasi"',
            'Klik kartu kategori "SatLantas" untuk filter',
            'Pilih pasal yang sesuai (klik "TAMBAH")',
            'Lihat total di panel Kalkulator',
            'Klik "KONFIRMASI HITUNG"',
            'Masukkan nama warga',
            'Klik "CATAT & KIRIM KE LAPORAN"',
            'Invoice otomatis tersimpan di tab Laporan',
          ],
        },
        {
          title: 'Workflow Cepat: Laporan Kriminal',
          desc: 'Cara membuat laporan tindak kriminal:',
          steps: [
            'Buka tab "Regulasi"',
            'Cari pasal yang sesuai (atau filter per kategori)',
            'Pilih minimal 1 pasal non-SatLantas',
            'Klik "TAMBAH" untuk setiap pasal',
            'Klik "KONFIRMASI HITUNG"',
            'Masukkan nama tersangka',
            'Sistem otomatis deteksi residivis',
            'Klik "CATAT & KIRIM KE LAPORAN"',
          ],
        },
        {
          title: 'Tips Mencari Pasal dengan Cepat',
          desc: 'Gunakan kombinasi pencarian dan filter:',
          tips: [
            'Ketik kode langsung untuk hasil paling cepat (contoh: "PM-05")',
            'Gunakan kata kunci deskripsi (contoh: "senjata", "narkoba")',
            'Klik kategori untuk filter, lalu cari di dalam kategori',
            'Gunakan pencarian untuk verifikasi apakah pasal sudah ada',
          ],
        },
        {
          title: 'Cek Riwayat Warga',
          desc: 'Untuk mengecek apakah warga pernah melanggar:',
          tips: [
            'Masukkan nama warga di modal konfirmasi',
            'Sistem otomatis cek database',
            'Jika pernah ditilang/ditangkap, peringatan akan muncul',
            'Lihat detail di tab Laporan → filter berdasarkan nama',
          ],
        },
      ],
    },
    {
      title: 'Performa & Browser',
      icon: <Monitor className="w-4 h-4" />,
      color: 'emerald',
      items: [
        {
          title: 'Browser yang Didukung',
          desc: 'Portal bekerja optimal di browser modern:',
          tips: [
            'Google Chrome (Recommended)',
            'Mozilla Firefox',
            'Microsoft Edge',
            'Safari (macOS/iOS)',
            'Gunakan versi terbaru untuk fitur terbaik',
          ],
        },
        {
          title: 'Tips Performa',
          desc: 'Untuk pengalaman terbaik:',
          tips: [
            'Gunakan koneksi internet stabil untuk sinkronisasi real-time',
            'Jika internet putus, portal otomatis mode offline',
            'Restart browser jika halaman terasa lambat',
            'Clear cache browser secara berkala',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      title: 'Pertanyaan Umum',
      icon: <HelpCircle className="w-4 h-4" />,
      color: 'cyan',
      items: [
        {
          title: 'Data saya hilang setelah clear browser?',
          desc: 'Jika portal terhubung ke internet, data tetap aman di cloud. Jika offline mode, data akan hilang saat clear browser. Pastikan selalu terhubung ke internet untuk backup otomatis.',
        },
        {
          title: 'Bagaimana jika internet tidak bisa diakses?',
          desc: 'Portal memiliki mode offline yang otomatis aktif. Artinya, kamu tetap bisa menggunakan portal tanpa koneksi internet. Namun, data tidak akan tersinkron antar perangkat.',
        },
        {
          title: 'Bagaimana menambah pasal baru selain 40 pasal default?',
          desc: 'Buka Dashboard (masukkan password) → klik "TAMBAH REGULASI BARU" → isi data pasal → klik "SIMPAN". Pasal baru langsung tersedia di menu Regulasi.',
        },
        {
          title: 'Bagaimana cara cetak surat tilang?',
          desc: 'Buka tab Laporan → pilih tab (Kriminal/Lalu Lintas) → klik ikon dokumen pada laporan → klik "CETAK" → pilih printer atau "Save as PDF".',
        },
        {
          title: 'Bagaimana cara menyesuaikan harga denda karena inflasi?',
          desc: 'Buka Dashboard → cari bagian "PENYESUAIAN HARGA INFLASI" → masukkan persentase (contoh: 100 untuk +100%) → klik "Terapkan". Semua harga denda akan berubah secara otomatis.',
        },
      ],
    },
  ],
};

export const DocumentationView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allItems = useMemo(() => {
    const items: { section: DocSection; groupTitle: string; item: DocItem; itemIndex: number }[] = [];
    Object.entries(docContent).forEach(([sectionKey, groups]) => {
      groups.forEach((group) => {
        group.items.forEach((item, idx) => {
          items.push({ section: sectionKey as DocSection, groupTitle: group.title, item, itemIndex: idx });
        });
      });
    });
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      (entry) =>
        entry.item.title.toLowerCase().includes(q) ||
        entry.item.desc.toLowerCase().includes(q) ||
        entry.groupTitle.toLowerCase().includes(q) ||
        entry.item.steps?.some((s) => s.toLowerCase().includes(q)) ||
        entry.item.tips?.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery, allItems]);

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    red: 'text-red-400 border-red-500/20 bg-red-500/5',
    blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  };

  const badgeColorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  const renderDocItem = (item: DocItem, sectionKey: string, groupIdx: number, itemIdx: number) => {
    const itemKey = `${sectionKey}-${groupIdx}-${itemIdx}`;
    const isExpanded = expandedItems.has(itemKey) || !item.steps;

    return (
      <motion.div
        key={itemKey}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: itemIdx * 0.02 }}
        className="border border-cyan-950/40 rounded-lg overflow-hidden hover:border-cyan-500/20 transition-all pointer-events-auto"
      >
        <button
          onClick={() => item.steps && toggleExpand(itemKey)}
          className={`w-full text-left p-2 sm:p-2.5 flex items-start gap-1.5 sm:gap-2 ${item.steps ? 'cursor-pointer hover:bg-slate-900/30' : ''}`}
        >
          {item.steps ? (
            <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-slate-200 font-sans font-semibold text-[11px] sm:text-xs">{item.title}</h4>
              {item.badge && (
                <span className={`text-[7px] sm:text-[8px] font-mono font-bold px-1 sm:px-1.5 py-0.5 rounded border ${badgeColorMap[item.badge.color] || badgeColorMap.cyan}`}>
                  {item.badge.text}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[10px] sm:text-[11px] font-sans leading-relaxed mt-0.5">{item.desc}</p>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2 sm:px-2.5 sm:pb-2.5 pl-6 sm:pl-7 space-y-1.5 sm:space-y-2">
                {item.steps && (
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400/60 uppercase tracking-wider">Langkah:</span>
                    <ol className="space-y-0.5 sm:space-y-1">
                      {item.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-300 font-sans">
                          <span className="text-cyan-400 font-mono font-bold text-[9px] sm:text-[10px] shrink-0 mt-px w-3 sm:w-4 text-right">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {item.tips && (
                  <div className="space-y-1">
                    <span className="text-[8px] sm:text-[9px] font-mono text-emerald-400/60 uppercase tracking-wider">Info:</span>
                    <ul className="space-y-0.5">
                      {item.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-300 font-sans">
                          <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => { setActiveSection(sec.id); setSearchQuery(''); setExpandedItems(new Set()); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[9px] font-display font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSection === sec.id
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-900/40 border-cyan-950 text-slate-500'
            }`}
          >
            {sec.icon}
            {sec.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col gap-1 w-44 shrink-0 overflow-y-auto compact-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => { setActiveSection(sec.id); setSearchQuery(''); setExpandedItems(new Set()); }}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.12)]'
                  : 'bg-slate-900/40 border-cyan-950 text-slate-500 hover:border-cyan-900 hover:text-slate-400'
              }`}
            >
              {sec.icon}
              {sec.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden compact-scrollbar min-h-0 pointer-events-auto">
          {/* Search */}
          <div className="relative mb-2 sm:mb-3">
            <input
              type="text"
              placeholder="Cari... (residivis, cetak, password)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-cyan-950 rounded-lg py-2 pl-3 pr-8 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-500/50 pointer-events-none" />
          </div>

          {/* Search Results */}
          {searchResults ? (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[10px] font-mono text-slate-500">
                {searchResults.length} hasil untuk "{searchQuery}"
              </p>
              {searchResults.map((entry) => (
                <div key={`${entry.section}-${entry.itemIndex}`}>
                  <p className="text-[9px] font-mono text-cyan-400/50 mb-1">
                    {sections.find((s) => s.id === entry.section)?.label} → {entry.groupTitle}
                  </p>
                  {renderDocItem(entry.item, entry.section, 0, entry.itemIndex)}
                </div>
              ))}
            </div>
          ) : (
            /* Section Content */
            <div className="space-y-3 sm:space-y-4">
              {docContent[activeSection]?.map((group, groupIdx) => (
                <div key={groupIdx}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 sm:p-1.5 rounded border ${colorMap[group.color] || colorMap.cyan}`}>
                      {group.icon}
                    </div>
                    <h3 className="text-slate-200 font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase">
                      {group.title}
                    </h3>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    {group.items.map((item, itemIdx) => renderDocItem(item, activeSection, groupIdx, itemIdx))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
