import React, { useState, useMemo, useRef } from 'react';
import {
  BookOpen, ShieldAlert, ClipboardList, FileText, LayoutDashboard,
  Search, AlertTriangle, CheckCircle, Info, Zap, Lock,
  ArrowRight, Monitor, Trash2, Edit2, Printer, RefreshCw,
  TrendingUp, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DocItem {
  title: string;
  desc: string;
  badge?: { text: string; color: 'cyan' | 'amber' | 'emerald' | 'red' | 'blue' };
  steps?: string[];
  tips?: string[];
}
interface DocGroup {
  title: string;
  icon: React.ReactNode;
  color: 'cyan' | 'amber' | 'emerald' | 'red' | 'blue';
  items: DocItem[];
}
interface DocSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  groups: DocGroup[];
}

// ─── Content ─────────────────────────────────────────────────────────────────
const sections: DocSection[] = [
  {
    id: 'overview',
    label: 'Ringkasan',
    icon: <ShieldAlert className="w-4 h-4" />,
    groups: [
      {
        title: 'Tentang Portal Ini',
        icon: <Info className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Apa itu Portal Regulasi Kepolisian?',
            desc: 'Portal ini adalah sistem manajemen pelanggaran untuk keperluan Roleplay. Membantu petugas mengelola pasal undang-undang, menghitung denda & hukuman, serta membuat laporan pelanggaran secara digital.',
          },
          {
            title: 'Siapa yang Boleh Menggunakan?',
            desc: 'Dikhususkan untuk anggota kepolisian dalam Roleplay. Semua menu bisa diakses langsung tanpa login. Hanya menu Dashboard yang memerlukan password khusus untuk admin.',
          },
          {
            title: 'Data Tersimpan di Cloud',
            desc: 'Semua data tersinkron secara real-time antar perangkat. Jika anggota A input laporan, anggota B langsung melihatnya. Jika internet mati, portal tetap berjalan dalam mode offline.',
          },
        ],
      },
      {
        title: '4 Menu Utama',
        icon: <Monitor className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: '📋 Regulasi — Browse & Pilih Pasal',
            desc: 'Lihat semua pasal undang-undang. Filter per kategori, cari dengan kata kunci, lalu tambahkan pasal ke kalkulator.',
            badge: { text: 'Menu Utama', color: 'cyan' },
          },
          {
            title: '🧮 Kalkulator — Hitung Denda',
            desc: 'Panel di halaman Regulasi untuk menghitung total denda & kurungan. Setelah yakin, klik Konfirmasi dan laporan otomatis dibuat.',
            badge: { text: 'Otomatis', color: 'emerald' },
          },
          {
            title: '📁 Laporan — Riwayat Pelanggaran',
            desc: 'Semua laporan yang sudah dibuat, dipisah 2 tab: Kriminal dan Lalu Lintas. Bisa lihat invoice detail dan cetak surat tilang.',
            badge: { text: '2 Tab', color: 'blue' },
          },
          {
            title: '🔒 Dashboard — Panel Admin',
            desc: 'Berisi grafik statistik, tabel semua pasal, dan fitur penyesuaian harga. Memerlukan password khusus.',
            badge: { text: 'Perlu Password', color: 'amber' },
          },
        ],
      },
      {
        title: 'Cara Kerja (3 Langkah)',
        icon: <ArrowRight className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: 'Alur Penggunaan Dasar',
            desc: 'Ikuti 3 langkah sederhana ini setiap kali menindak pelanggaran:',
            steps: [
              'Buka menu Regulasi → pilih pasal yang sesuai',
              'Cek total denda di panel Kalkulator → klik Konfirmasi',
              'Laporan otomatis tersimpan di menu Laporan',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'auth',
    label: 'Login & Akses',
    icon: <Lock className="w-4 h-4" />,
    groups: [
      {
        title: 'Akses Portal',
        icon: <Lock className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Masuk ke Portal',
            desc: 'Buka URL portal di browser → langsung masuk ke halaman utama. Tidak perlu akun atau password untuk menu Regulasi, Kalkulator, dan Laporan.',
            badge: { text: 'Langsung Akses', color: 'emerald' },
          },
          {
            title: 'Membuka Dashboard (Admin)',
            desc: 'Dashboard memerlukan password tambahan untuk keamanan data.',
            steps: [
              'Klik tab "Dashboard" di navigasi bawah',
              'Kotak password akan muncul',
              'Masukkan password admin',
              'Klik tombol UNLOCK',
              'Password tersimpan 24 jam — tidak perlu masuk ulang',
            ],
            badge: { text: 'Proteksi 24 Jam', color: 'amber' },
          },
        ],
      },
    ],
  },
  {
    id: 'regulasi',
    label: 'Menu Regulasi',
    icon: <BookOpen className="w-4 h-4" />,
    groups: [
      {
        title: 'Melihat & Mencari Pasal',
        icon: <Search className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Daftar Semua Pasal',
            desc: 'Semua pasal tampil dalam daftar yang bisa di-scroll. Setiap pasal menampilkan kode, deskripsi, denda (Rp), dan masa kurungan (bulan).',
          },
          {
            title: 'Cara Mencari Pasal',
            desc: 'Gunakan kolom pencarian di atas daftar.',
            steps: [
              'Ketuk kolom pencarian',
              'Ketik kode pasal (contoh: SL-01) atau kata kunci (contoh: helm, narkoba)',
              'Daftar otomatis menyaring secara real-time',
              'Kosongkan kolom untuk kembali ke semua pasal',
            ],
          },
          {
            title: 'Filter per Kategori',
            desc: 'Ketuk salah satu kartu kategori untuk menyaring pasal:',
            tips: [
              'SatLantas (SL) — Pelanggaran lalu lintas — Warna Cyan',
              'Ringan (PR) — Pelanggaran ketertiban umum — Warna Hijau',
              'Menengah (PM) — Kejahatan menengah — Warna Kuning',
              'Berat (PB) — Kejahatan berat — Warna Merah',
              'Ketuk kategori yang sama lagi untuk menghapus filter',
            ],
          },
        ],
      },
      {
        title: 'Sistem Kode Pasal',
        icon: <Zap className="w-4 h-4" />,
        color: 'amber',
        items: [
          {
            title: 'Format Kode Pasal',
            desc: 'Setiap pasal punya kode unik: huruf kategori + nomor urut.',
            tips: [
              'SL-01 s/d SL-10 — 10 Pasal Lalu Lintas',
              'PR-01 s/d PR-10 — 10 Pasal Ringan',
              'PM-01 s/d PM-10 — 10 Pasal Menengah',
              'PB-01 s/d PB-10 — 10 Pasal Berat',
              'Total: 40 pasal default (bisa ditambah di Dashboard)',
            ],
          },
          {
            title: 'Kategori & Jenis Laporan',
            desc: 'Kategori pasal menentukan laporan masuk ke tab mana:',
            tips: [
              'Semua pasal SatLantas → Tab "Lalu Lintas"',
              'Ada 1 pasal non-SatLantas → masuk Tab "Kriminal"',
              'Pasal campuran (SL + PM misalnya) → Tab "Kriminal"',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kalkulator',
    label: 'Kalkulator',
    icon: <ClipboardList className="w-4 h-4" />,
    groups: [
      {
        title: 'Menggunakan Kalkulator',
        icon: <ClipboardList className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Langkah-langkah Lengkap',
            desc: 'Ikuti urutan ini untuk menghitung denda dan membuat laporan:',
            steps: [
              'Buka tab Regulasi',
              'Cari pasal yang sesuai pelanggaran',
              'Ketuk tombol TAMBAH pada pasal',
              'Ulangi untuk setiap pasal tambahan',
              'Lihat total denda & kurungan di panel Kalkulator',
              'Ketuk KONFIRMASI HITUNG',
              'Ketik nama tersangka/warga',
              'Ketuk CATAT & KIRIM KE LAPORAN',
              'Otomatis pindah ke tab Laporan',
            ],
          },
          {
            title: 'Isi Panel Kalkulator',
            desc: 'Panel kalkulator menampilkan ringkasan pilihan pasal:',
            tips: [
              'Total Denda — jumlah semua denda dalam Rupiah',
              'Total Kurungan — jumlah waktu penjara dalam bulan',
              'Daftar Pasal — semua pasal yang sudah dipilih',
              'Ikon Sampah — hapus satu pasal dari daftar',
              'Tombol RESET — hapus semua pilihan, mulai ulang',
            ],
          },
        ],
      },
      {
        title: 'Deteksi Residivis & Riwayat',
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'amber',
        items: [
          {
            title: 'Sistem Deteksi Otomatis',
            desc: 'Saat mengetik nama tersangka di form konfirmasi, sistem langsung mengecek apakah nama itu pernah ada di laporan sebelumnya.',
            badge: { text: 'Otomatis', color: 'amber' },
          },
          {
            title: 'Jika Pelanggaran Lalu Lintas',
            desc: 'Jika semua pasal yang dipilih adalah SatLantas:',
            tips: [
              'Muncul peringatan "WARGA INI PERNAH DITILANG"',
              'Tampil jumlah berapa kali pernah ditilang',
              'Tampil total denda yang pernah dibayar',
              'Tampil pasal-pasal yang pernah dilanggar',
            ],
          },
          {
            title: 'Jika Tindak Kriminal',
            desc: 'Jika ada minimal 1 pasal non-SatLantas:',
            tips: [
              'Muncul peringatan "SUSPECT RESIDIVIS"',
              'Tampil jumlah berapa kali pernah ditangkap',
              'Tampil total waktu penjara yang pernah dijalani',
              'Tampil total denda dan pasal yang pernah dikenakan',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'laporan',
    label: 'Menu Laporan',
    icon: <FileText className="w-4 h-4" />,
    groups: [
      {
        title: 'Struktur Menu Laporan',
        icon: <FileText className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Dua Tab Kategori',
            desc: 'Menu Laporan dibagi menjadi 2 tab:',
            tips: [
              'Tab Kriminal — semua tindak pidana (ringan/menengah/berat)',
              'Tab Lalu Lintas — semua pelanggaran SatLantas',
              'Jumlah laporan ditampilkan di setiap tab',
              'Angka merah di ikon nav = jumlah laporan hari ini',
            ],
          },
          {
            title: 'Isi Setiap Kartu Laporan',
            desc: 'Setiap laporan menampilkan informasi berikut:',
            tips: [
              'ID Laporan (contoh: REP-1234567890)',
              'Tanggal & waktu pembuatan laporan',
              'Nama tersangka atau pelanggar',
              'Daftar kode pasal yang dikenakan',
              'Total denda dan total masa kurungan',
              'Badge RESIDIVIS atau PELANGGARAN ULANG (jika pernah)',
            ],
          },
        ],
      },
      {
        title: 'Pencarian di Laporan',
        icon: <Search className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: 'Cari Laporan',
            desc: 'Gunakan kolom pencarian di atas daftar laporan untuk mencari berdasarkan nama, ID laporan, atau kode pasal secara real-time.',
          },
        ],
      },
      {
        title: 'Invoice & Cetak',
        icon: <Printer className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: 'Melihat & Mencetak Invoice',
            desc: 'Setiap laporan bisa dilihat detailnya dan dicetak sebagai surat tilang.',
            steps: [
              'Ketuk ikon dokumen pada kartu laporan',
              'Modal invoice terbuka dengan detail lengkap',
              'Ketuk CETAK untuk mencetak atau simpan PDF',
              'Ketuk TUTUP untuk menutup modal',
            ],
          },
          {
            title: 'Salin Laporan ke Discord',
            desc: 'Ketuk ikon salin di kartu laporan untuk menyalin teks laporan siap pakai ke Discord. Format sudah disesuaikan untuk laporan kriminal dan lalu lintas.',
            badge: { text: 'Siap Pakai', color: 'cyan' },
          },
        ],
      },
      {
        title: 'Menghapus Laporan',
        icon: <Trash2 className="w-4 h-4" />,
        color: 'red',
        items: [
          {
            title: 'Cara Menghapus & Membatalkan',
            desc: 'Ketuk ikon tempat sampah pada kartu laporan.',
            steps: [
              'Ketuk ikon tempat sampah 🗑️',
              'Toast peringatan muncul: "Laporan akan dihapus..."',
              'Ketuk BATAL dalam 5 detik jika ingin membatalkan',
              'Jika dibiarkan, laporan terhapus otomatis setelah 5 detik',
            ],
            badge: { text: 'Ada Tombol Batal', color: 'amber' },
          },
        ],
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    groups: [
      {
        title: 'Akses Dashboard',
        icon: <Lock className="w-4 h-4" />,
        color: 'amber',
        items: [
          {
            title: 'Cara Masuk Dashboard',
            desc: '',
            steps: [
              'Ketuk tab Dashboard di navigasi bawah',
              'Masukkan password admin',
              'Ketuk UNLOCK',
              'Akses tersimpan 24 jam di browser',
            ],
            badge: { text: 'Password Khusus', color: 'amber' },
          },
        ],
      },
      {
        title: 'Statistik & Grafik',
        icon: <LayoutDashboard className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: '4 Kartu Statistik',
            desc: 'Di bagian atas Dashboard tersedia 4 kartu:',
            tips: [
              'Total Pasal — jumlah semua pasal di sistem',
              'Total Laporan — total semua laporan',
              'Kriminal — jumlah laporan kriminal',
              'Lalu Lintas — jumlah laporan tilang',
            ],
          },
          {
            title: 'Grafik Donut & Batang',
            desc: 'Dua grafik visual ditampilkan otomatis:',
            tips: [
              'Grafik Donut — persentase pasal per kategori',
              'Grafik Batang — jumlah laporan per hari (seminggu terakhir)',
            ],
          },
        ],
      },
      {
        title: 'Penyesuaian Harga (Inflasi)',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'amber',
        items: [
          {
            title: 'Cara Mengubah Semua Denda Sekaligus',
            desc: 'Gunakan fitur ini untuk menyesuaikan harga denda mengikuti kondisi ekonomi server.',
            steps: [
              'Buka Dashboard',
              'Cari bagian "Penyesuaian Harga Inflasi"',
              'Masukkan persentase (contoh: 100 untuk +100%)',
              'Atau ketuk tombol cepat: +10%, +50%, +100%, dll.',
              'Ketuk Terapkan → konfirmasi',
              'Semua denda berubah otomatis',
            ],
            badge: { text: 'Mengubah Semua Pasal', color: 'amber' },
          },
          {
            title: 'Yang Perlu Diketahui',
            desc: '',
            tips: [
              'Perubahan berlaku untuk SEMUA pasal sekaligus',
              'Harga dibulatkan ke angka terdekat',
              'Laporan yang sudah ada tidak ikut berubah',
              'Hanya laporan baru yang pakai harga terbaru',
            ],
          },
        ],
      },
      {
        title: 'Manajemen Pasal',
        icon: <Edit2 className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: 'Menambah Pasal Baru',
            desc: '',
            steps: [
              'Ketuk tombol TAMBAH REGULASI BARU',
              'Isi Kode Pasal (unik, contoh: SL-11)',
              'Isi Deskripsi singkat pelanggaran',
              'Isi Denda dalam Rupiah',
              'Isi Kurungan dalam Bulan (0 jika tidak ada)',
              'Pilih Kategori dari dropdown',
              'Ketuk SIMPAN',
            ],
          },
          {
            title: 'Mengedit Pasal',
            desc: '',
            steps: [
              'Ketuk ikon pensil ✏️ pada baris pasal',
              'Ubah field yang perlu diubah',
              'Ketuk SIMPAN',
              'Perubahan langsung berlaku di semua menu',
            ],
          },
          {
            title: 'Menghapus Pasal',
            desc: 'Ketuk ikon tempat sampah pada baris pasal. Konfirmasi akan muncul sebelum penghapusan.',
            tips: [
              'Pasal yang dihapus juga hilang dari kalkulator',
              'Tidak bisa dikembalikan setelah dihapus',
            ],
            badge: { text: 'Permanen', color: 'red' },
          },
        ],
      },
    ],
  },
  {
    id: 'tips',
    label: 'Tips & Trik',
    icon: <Zap className="w-4 h-4" />,
    groups: [
      {
        title: 'Workflow Cepat',
        icon: <Zap className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: '⚡ Tilang Lalu Lintas (Tercepat)',
            desc: '',
            steps: [
              'Buka Regulasi → ketuk kartu SatLantas untuk filter',
              'Pilih pasal (ketuk TAMBAH)',
              'Lihat total → ketuk KONFIRMASI HITUNG',
              'Isi nama → ketuk CATAT & KIRIM',
            ],
          },
          {
            title: '⚡ Laporan Kriminal',
            desc: '',
            steps: [
              'Buka Regulasi → cari pasal yang sesuai',
              'Pilih minimal 1 pasal non-SatLantas',
              'Kalkulator otomatis hitung total denda + kurungan',
              'Konfirmasi → isi nama → sistem cek riwayat otomatis',
              'Kirim ke Laporan',
            ],
          },
          {
            title: '💡 Tips Cari Pasal Cepat',
            desc: '',
            tips: [
              'Ketik kode langsung untuk hasil instan (contoh: PM-05)',
              'Ketik kata kunci deskripsi (contoh: senjata, helm, narkoba)',
              'Gabung filter kategori + pencarian untuk hasil lebih spesifik',
            ],
          },
          {
            title: '📱 Tips Khusus Android',
            desc: '',
            tips: [
              'Tombol back → kembali ke halaman sebelumnya (tidak keluar browser)',
              'Tarik layar ke bawah untuk refresh data dari server',
              'Angka merah di nav = laporan yang dibuat hari ini',
              'Klik BATAL di toast untuk batalkan hapus laporan',
            ],
          },
        ],
      },
      {
        title: 'Performa & Koneksi',
        icon: <Monitor className="w-4 h-4" />,
        color: 'emerald',
        items: [
          {
            title: 'Browser yang Direkomendasikan',
            desc: '',
            tips: [
              'Google Chrome (terbaik)',
              'Mozilla Firefox',
              'Microsoft Edge',
              'Safari (iOS/macOS)',
              'Gunakan versi terbaru untuk hasil optimal',
            ],
          },
          {
            title: 'Jika Portal Lambat atau Error',
            desc: '',
            tips: [
              'Tarik layar ke bawah untuk pull-to-refresh',
              'Coba refresh halaman browser (Ctrl+R / Cmd+R)',
              'Clear cache browser secara berkala',
              'Pastikan koneksi internet stabil',
              'Portal tetap bisa dipakai saat offline (mode cache)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: <Info className="w-4 h-4" />,
    groups: [
      {
        title: 'Pertanyaan yang Sering Ditanyakan',
        icon: <Info className="w-4 h-4" />,
        color: 'cyan',
        items: [
          {
            title: 'Data hilang setelah clear browser?',
            desc: 'Jika terhubung internet, data aman di cloud dan tidak akan hilang. Hanya jika offline dan clear browser data lokal yang hilang. Selalu pastikan terhubung internet untuk backup otomatis.',
          },
          {
            title: 'Bisa dipakai saat internet mati?',
            desc: 'Ya. Portal otomatis beralih ke mode offline menggunakan cache. Kamu tetap bisa membuka portal dan melihat data terakhir. Namun data tidak tersinkron antar perangkat hingga koneksi pulih.',
          },
          {
            title: 'Cara menambah pasal di luar 40 pasal default?',
            desc: 'Buka Dashboard → masukkan password admin → klik TAMBAH REGULASI BARU → isi data pasal → Simpan. Pasal baru langsung muncul di menu Regulasi.',
          },
          {
            title: 'Cara cetak surat tilang?',
            desc: 'Buka Laporan → ketuk ikon dokumen pada laporan → ketuk CETAK di modal → pilih printer atau Save as PDF.',
          },
          {
            title: 'Cara update harga semua denda sekaligus?',
            desc: 'Buka Dashboard → cari "Penyesuaian Harga Inflasi" → masukkan persentase → klik Terapkan. Semua harga berubah otomatis.',
          },
          {
            title: 'Laporan terhapus tidak sengaja, bisa dikembalikan?',
            desc: 'Saat menghapus laporan, ada toast dengan tombol BATAL yang aktif selama 5 detik. Segera ketuk BATAL sebelum waktu habis. Jika sudah terhapus sepenuhnya, tidak bisa dikembalikan.',
            badge: { text: 'Penting', color: 'amber' },
          },
        ],
      },
    ],
  },
];

// ─── Color Maps ───────────────────────────────────────────────────────────────
const sectionColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  overview:    { bg: 'bg-cyan-500/8',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  auth:        { bg: 'bg-amber-500/8',   border: 'border-amber-500/25',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  regulasi:    { bg: 'bg-cyan-500/8',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  kalkulator:  { bg: 'bg-emerald-500/8', border: 'border-emerald-500/25', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  laporan:     { bg: 'bg-blue-500/8',    border: 'border-blue-500/25',    text: 'text-blue-400',    dot: 'bg-blue-400'    },
  dashboard:   { bg: 'bg-amber-500/8',   border: 'border-amber-500/25',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  tips:        { bg: 'bg-cyan-500/8',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    dot: 'bg-cyan-400'    },
  faq:         { bg: 'bg-slate-500/8',   border: 'border-slate-500/25',   text: 'text-slate-400',   dot: 'bg-slate-400'   },
};

const badgeColors: Record<string, string> = {
  cyan:    'bg-cyan-500/10    border border-cyan-500/30    text-cyan-400',
  amber:   'bg-amber-500/10   border border-amber-500/30   text-amber-400',
  emerald: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
  red:     'bg-red-500/10     border border-red-500/30     text-red-400',
  blue:    'bg-blue-500/10    border border-blue-500/30    text-blue-400',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const DocumentationView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ── Search ──
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const matches: { sectionLabel: string; item: DocItem }[] = [];
    sections.forEach((sec) => {
      sec.groups.forEach((group) => {
        group.items.forEach((item) => {
          if (
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.steps?.some((s) => s.toLowerCase().includes(q)) ||
            item.tips?.some((t) => t.toLowerCase().includes(q))
          ) {
            matches.push({ sectionLabel: `${sec.label} › ${group.title}`, item });
          }
        });
      });
    });
    return matches;
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Render a single doc item ──
  const renderItem = (item: DocItem, idx: number) => (
    <div key={idx} className="space-y-2">
      {/* Title + badge */}
      <div className="flex items-start gap-2 flex-wrap">
        {item.title && (
          <h4 className="text-slate-100 font-semibold text-sm leading-snug">{item.title}</h4>
        )}
        {item.badge && (
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${badgeColors[item.badge.color]}`}>
            {item.badge.text}
          </span>
        )}
      </div>

      {/* Description */}
      {item.desc && (
        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
      )}

      {/* Steps — always visible, numbered */}
      {item.steps && (
        <ol className="space-y-1.5 mt-1">
          {item.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      )}

      {/* Tips — always visible, bullets */}
      {item.tips && (
        <ul className="space-y-1.5 mt-1">
          {item.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400/70 mt-2" />
              <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ── Search Bar ── */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari panduan... (contoh: cetak, residivis, password)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/60 border border-cyan-950/60 rounded-xl py-2.5 pl-9 pr-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Quick Jump Nav — only show when not searching ── */}
      {!searchQuery && (
        <div className="flex gap-1.5 flex-wrap shrink-0">
          {sections.map((sec) => {
            const c = sectionColors[sec.id];
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider border transition-all cursor-pointer ${c.bg} ${c.border} ${c.text} hover:opacity-80`}
              >
                {sec.icon}
                <span className="hidden sm:inline">{sec.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto compact-scrollbar -mx-0.5 px-0.5">

        {/* Search Results */}
        {searchResults ? (
          <div className="space-y-3 pb-4">
            <p className="text-[11px] font-mono text-slate-500">
              {searchResults.length} hasil untuk "{searchQuery}"
            </p>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Tidak ada hasil. Coba kata kunci lain.
              </div>
            ) : (
              searchResults.map((entry, i) => (
                <div key={i} className="bg-slate-900/40 border border-cyan-950/50 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-wider">{entry.sectionLabel}</p>
                  {renderItem(entry.item, i)}
                </div>
              ))
            )}
          </div>
        ) : (

          /* All Sections — single continuous scroll */
          <div className="space-y-6 pb-6">
            {sections.map((sec) => {
              const c = sectionColors[sec.id];
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  ref={(el) => { sectionRefs.current[sec.id] = el; }}
                >
                  {/* Section Header */}
                  <div className={`flex items-center gap-3 mb-3 pb-2 border-b ${c.border}`}>
                    <div className={`p-1.5 rounded-lg border ${c.bg} ${c.border} ${c.text}`}>
                      {sec.icon}
                    </div>
                    <h2 className={`font-display font-black text-sm uppercase tracking-widest ${c.text}`}>
                      {sec.label}
                    </h2>
                    <div className={`h-px flex-1 ${c.bg}`} />
                  </div>

                  {/* Groups */}
                  <div className="space-y-4">
                    {sec.groups.map((group, gi) => (
                      <div key={gi} className="bg-slate-900/30 border border-slate-800/50 rounded-xl overflow-hidden">
                        {/* Group title */}
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/50 bg-slate-900/40">
                          <span className={`${c.text} opacity-70`}>{group.icon}</span>
                          <h3 className="text-slate-300 font-display font-bold text-[11px] uppercase tracking-wider">
                            {group.title}
                          </h3>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-slate-800/40">
                          {group.items.map((item, ii) => (
                            <div key={ii} className="px-4 py-3.5">
                              {renderItem(item, ii)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
