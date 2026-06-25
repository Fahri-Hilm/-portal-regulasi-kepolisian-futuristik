import { Regulation, IncidentReport } from './types';

// ============================================================
// CATATAN REVISI DATA — v1.2.0 (2026-06-25)
// ============================================================
// Penyesuaian harga berdasarkan inflasi sektor medis kota:
//   - Obat/perban lama: Rp2.500–Rp5.000/item
//   - Paket medis saat ini: Rp200.000 (10 bandage + 5 obat)
//   - Kenaikan: ~300%–500% dari periode sebelumnya
//   - Tindakan medis: Rp200.000 | Operasi sedang: Rp400.000 | Operasi besar: Rp600.000
//
// Aturan penjara: MAKSIMAL 120 BULAN per kota (tidak ada batas denda)
//
// Perbaikan tumpang tindih:
//   - PR-06 diganti → "Vandalisme/Coret Fasilitas Publik" (beda dengan PM-06 yg skala besar)
//   - PB-09 (bunuh polisi) kini lebih berat dari PB-01 (bunuh sipil) — logika diperbaiki
// ============================================================

export const INITIAL_REGULATIONS: Regulation[] = [

  // ── SATLANTAS (Pelanggaran Lalu Lintas) ──────────────────────────────────
  { id: 'sl-01', code: 'SL-01', description: 'Melanggar Lampu Merah',                                    fine: 150000,   jailTime: 0,  category: 'satlantas' },
  { id: 'sl-02', code: 'SL-02', description: 'Melanggar Marka Jalan / Melawan Arus',                     fine: 100000,   jailTime: 0,  category: 'satlantas' },
  { id: 'sl-03', code: 'SL-03', description: 'Berkendara di Atas Trotoar / Area Pejalan Kaki',           fine: 125000,   jailTime: 0,  category: 'satlantas' },
  { id: 'sl-04', code: 'SL-04', description: 'Melakukan Aksi Balapan Liar di Jalan Umum',                fine: 500000,   jailTime: 2,  category: 'satlantas' },
  { id: 'sl-05', code: 'SL-05', description: 'Tidak Menggunakan Helm Standar / Sabuk Pengaman',          fine: 75000,    jailTime: 0,  category: 'satlantas' },
  { id: 'sl-06', code: 'SL-06', description: 'Mengemudi Tanpa Surat Izin Mengemudi (SIM)',               fine: 200000,   jailTime: 0,  category: 'satlantas' },
  { id: 'sl-07', code: 'SL-07', description: 'Menggunakan Plat Nomor Palsu / Tidak Terdaftar',           fine: 500000,   jailTime: 3,  category: 'satlantas' },
  { id: 'sl-08', code: 'SL-08', description: 'Berkendara di Bawah Pengaruh Alkohol / Zat (DUI)',         fine: 750000,   jailTime: 4,  category: 'satlantas' },
  { id: 'sl-09', code: 'SL-09', description: 'Melarikan Diri dari Pemeriksaan Razia Polantas',           fine: 400000,   jailTime: 2,  category: 'satlantas' },
  { id: 'sl-10', code: 'SL-10', description: 'Menggunakan Kendaraan Modifikasi Ekstrim / Tidak Layak Jalan', fine: 200000, jailTime: 0, category: 'satlantas' },

  // ── RINGAN (Pelanggaran Ketertiban Umum) ─────────────────────────────────
  // CATATAN: PR-06 diubah dari "Perusakan Ringan" → "Vandalisme/Coret-coret"
  //          agar tidak tumpang tindih dengan PM-06 (Perusakan Properti Besar)
  { id: 'pr-01', code: 'PR-01', description: 'Penghinaan Verbal Terhadap Petugas Kepolisian',            fine: 250000,   jailTime: 2,  category: 'ringan' },
  { id: 'pr-02', code: 'PR-02', description: 'Tidak Membawa Kartu Identitas (KTP) saat Razia',           fine: 100000,   jailTime: 0,  category: 'ringan' },
  { id: 'pr-03', code: 'PR-03', description: 'Membuang Sampah Sembarangan / Mengotori Fasilitas Kota',   fine: 75000,    jailTime: 0,  category: 'ringan' },
  { id: 'pr-04', code: 'PR-04', description: 'Membuat Kebisingan di Area Pemukiman di Atas Jam Malam',   fine: 150000,   jailTime: 0,  category: 'ringan' },
  { id: 'pr-05', code: 'PR-05', description: 'Menghalangi Akses Jalan Publik / Parkir Sembarangan',      fine: 175000,   jailTime: 0,  category: 'ringan' },
  { id: 'pr-06', code: 'PR-06', description: 'Vandalisme / Coret-coret Fasilitas Publik (Skala Kecil)',  fine: 350000,   jailTime: 2,  category: 'ringan' },
  { id: 'pr-07', code: 'PR-07', description: 'Merokok di Area Terlarang atau Dekat Pom Bensin',          fine: 100000,   jailTime: 0,  category: 'ringan' },
  { id: 'pr-08', code: 'PR-08', description: 'Melakukan Provokasi Massa / Menyebarkan Berita Hoaks',     fine: 500000,   jailTime: 3,  category: 'ringan' },
  { id: 'pr-09', code: 'PR-09', description: 'Pencemaran Nama Baik Warga Kota Melalui Media',            fine: 400000,   jailTime: 2,  category: 'ringan' },
  { id: 'pr-10', code: 'PR-10', description: 'Memasuki Area Terlarang / Area Militer Tanpa Izin',        fine: 300000,   jailTime: 3,  category: 'ringan' },

  // ── MENENGAH (Kejahatan Kelas Menengah) ──────────────────────────────────
  // CATATAN: PM-06 dipertahankan sebagai "Perusakan Properti Berskala Besar"
  //          (berbeda dengan PR-06 yang skala kecil/vandalisme)
  { id: 'pm-01', code: 'PM-01', description: 'Pencurian Skala Kecil (Toko / Rumah / Kendaraan)',         fine: 750000,   jailTime: 4,  category: 'menengah' },
  { id: 'pm-02', code: 'PM-02', description: 'Penganiayaan Ringan Tanpa Senjata Terhadap Warga',         fine: 1000000,  jailTime: 5,  category: 'menengah' },
  { id: 'pm-03', code: 'PM-03', description: 'Penipuan Transaksi Publik / Jual Beli Bodong',             fine: 1000000,  jailTime: 5,  category: 'menengah' },
  { id: 'pm-04', code: 'PM-04', description: 'Membawa Senjata Tajam di Ruang Publik Tanpa Izin Kerja',   fine: 1500000,  jailTime: 6,  category: 'menengah' },
  { id: 'pm-05', code: 'PM-05', description: 'Mencoba Menyuap Petugas Kepolisian / Aparat Hukum',       fine: 2000000,  jailTime: 8,  category: 'menengah' },
  { id: 'pm-06', code: 'PM-06', description: 'Perusakan Properti Warga Berskala Besar (Disengaja)',      fine: 1250000,  jailTime: 6,  category: 'menengah' },
  { id: 'pm-07', code: 'PM-07', description: 'Pemerasan / Intimidasi Finansial Terhadap Korban',        fine: 1500000,  jailTime: 6,  category: 'menengah' },
  { id: 'pm-08', code: 'PM-08', description: 'Tabrak Lari yang Mengakibatkan Kerusakan Properti / Korban', fine: 2000000, jailTime: 8, category: 'menengah' },
  { id: 'pm-09', code: 'PM-09', description: 'Kepemilikan dan Konsumsi Narkoba Dosis Kecil (Pribadi)',   fine: 1500000,  jailTime: 8,  category: 'menengah' },
  { id: 'pm-10', code: 'PM-10', description: 'Sengaja Menghalangi Penyidikan / Menghilangkan Barang Bukti', fine: 1000000, jailTime: 6, category: 'menengah' },

  // ── BERAT (Kejahatan Kelas Berat) ────────────────────────────────────────
  // CATATAN: Maks penjara = 120 bulan per peraturan kota
  // CATATAN: PB-09 (bunuh polisi) kini lebih berat dari PB-01 (bunuh sipil) — logika diperbaiki
  { id: 'pb-01', code: 'PB-01', description: 'Pembunuhan Berencana Terhadap Warga Sipil',                fine: 10000000, jailTime: 72,  category: 'berat' },
  { id: 'pb-02', code: 'PB-02', description: 'Melakukan Perampokan Bank Utama / Toko Emas',              fine: 7500000,  jailTime: 48,  category: 'berat' },
  { id: 'pb-03', code: 'PB-03', description: 'Membawa atau Menyimpan Senjata Api Ilegal Kelas Militer',  fine: 5000000,  jailTime: 36,  category: 'berat' },
  { id: 'pb-04', code: 'PB-04', description: 'Penyerangan Bersenjata Terhadap Markas Kepolisian',        fine: 7500000,  jailTime: 48,  category: 'berat' },
  { id: 'pb-05', code: 'PB-05', description: 'Perdagangan / Menjadi Bandar Narkoba Skala Besar',         fine: 10000000, jailTime: 60,  category: 'berat' },
  { id: 'pb-06', code: 'PB-06', description: 'Penyanderaan Warga Negara Menggunakan Senjata',            fine: 6000000,  jailTime: 48,  category: 'berat' },
  { id: 'pb-07', code: 'PB-07', description: 'Melakukan Makar Terhadap Instansi Pemerintah Kota',        fine: 15000000, jailTime: 96,  category: 'berat' },
  { id: 'pb-08', code: 'PB-08', description: 'Aksi Terorisme / Peledakan Bom di Tempat Umum',            fine: 20000000, jailTime: 120, category: 'berat' }, // MAKSIMUM
  { id: 'pb-09', code: 'PB-09', description: 'Pembunuhan Petugas Kepolisian / Aparat saat Bertugas',     fine: 12000000, jailTime: 90,  category: 'berat' }, // lebih berat dari PB-01
  { id: 'pb-10', code: 'PB-10', description: 'Tindakan Korupsi Keuangan Daerah / Suap Skala Besar',      fine: 10000000, jailTime: 60,  category: 'berat' },
];

// Sample reports — diperbarui agar total sesuai harga baru
export const INITIAL_REPORTS: IncidentReport[] = [
  {
    id: 'rep-1',
    timestamp: '2026-06-23T08:15:00+07:00',
    citizenName: 'Budi Santoso',
    articles: ['sl-01', 'sl-05', 'sl-06'],
    totalFine: 425000,    // sl-01 (150k) + sl-05 (75k) + sl-06 (200k)
    totalJailTime: 0,
    type: 'lalu_lintas',
  },
  {
    id: 'rep-2',
    timestamp: '2026-06-22T21:40:00+07:00',
    citizenName: 'Michael Corleone',
    articles: ['pm-04', 'pm-05'],
    totalFine: 3500000,   // pm-04 (1.5jt) + pm-05 (2jt)
    totalJailTime: 14,    // pm-04 (6) + pm-05 (8)
    type: 'kriminal',
  },
  {
    id: 'rep-3',
    timestamp: '2026-06-21T14:30:00+07:00',
    citizenName: 'Jessica Alva',
    articles: ['sl-08', 'sl-03'],
    totalFine: 875000,    // sl-08 (750k) + sl-03 (125k)
    totalJailTime: 4,     // sl-08 (4) + sl-03 (0)
    type: 'lalu_lintas',
  },
];
