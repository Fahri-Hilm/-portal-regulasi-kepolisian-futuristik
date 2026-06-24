-- ============================================
-- PORTAL REGULASI KEPOLISIAN FUTURISTIK
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: regulations
-- ============================================
CREATE TABLE IF NOT EXISTS regulations (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  fine NUMERIC(12, 2) NOT NULL DEFAULT 0,
  jail_time INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('satlantas', 'ringan', 'menengah', 'berat')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_regulations_category ON regulations(category);
CREATE INDEX IF NOT EXISTS idx_regulations_code ON regulations(code);

-- ============================================
-- TABLE: reports
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  citizen_name TEXT NOT NULL,
  articles TEXT[] NOT NULL DEFAULT '{}',
  total_fine NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_jail_time INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('kriminal', 'lalu_lintas')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for type filtering and citizen name lookup
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_citizen_name ON reports(citizen_name);
CREATE INDEX IF NOT EXISTS idx_reports_timestamp ON reports(timestamp DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS but allow all operations for now (no auth)
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow all operations (can be restricted later with Supabase Auth)
CREATE POLICY "Allow all operations on regulations" ON regulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on reports" ON reports FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- REALTIME: Enable replication for live sync
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE regulations;
ALTER PUBLICATION supabase_realtime ADD TABLE reports;

-- ============================================
-- FUNCTIONS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_regulations_updated_at
  BEFORE UPDATE ON regulations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Default regulations
-- ============================================
INSERT INTO regulations (id, code, description, fine, jail_time, category) VALUES
  ('sl-01', 'SL-01', 'Melanggar Lampu Merah', 5000, 0, 'satlantas'),
  ('sl-02', 'SL-02', 'Melanggar Marka Jalan / Melawan Arus', 2500, 0, 'satlantas'),
  ('sl-03', 'SL-03', 'Berkendara di Atas Trotoar / Area Pejalan Kaki', 3500, 0, 'satlantas'),
  ('sl-04', 'SL-04', 'Melakukan Aksi Balapan Liar di Jalan Umum', 15000, 1, 'satlantas'),
  ('sl-05', 'SL-05', 'Tidak Menggunakan Helm Standar / Sabuk Pengaman', 1500, 0, 'satlantas'),
  ('sl-06', 'SL-06', 'Mengemudi Tanpa Surat Izin Mengemudi (SIM)', 6000, 0, 'satlantas'),
  ('sl-07', 'SL-07', 'Menggunakan Plat Nomor Palsu / Tidak Terdaftar', 10000, 1, 'satlantas'),
  ('sl-08', 'SL-08', 'Berkendara di Bawah Pengaruh Alkohol (DUI)', 20000, 2, 'satlantas'),
  ('sl-09', 'SL-09', 'Melarikan Diri dari Pemeriksaan Razia Polantas', 12000, 1, 'satlantas'),
  ('sl-10', 'SL-10', 'Menggunakan Kendaraan Modifikasi Ekstrim / Tidak Layak Jalan', 4000, 0, 'satlantas'),
  ('pr-01', 'PR-01', 'Penghinaan Verbal Terhadap Petugas Kepolisian', 5000, 1, 'ringan'),
  ('pr-02', 'PR-02', 'Tidak Membawa Kartu Identitas (KTP) saat Razia', 2000, 0, 'ringan'),
  ('pr-03', 'PR-03', 'Membuang Sampah Sembarangan / Mengotori Fasilitas Kota', 1000, 0, 'ringan'),
  ('pr-04', 'PR-04', 'Membuat Kebisingan di Area Pemukiman di Atas Jam Malam', 3000, 0, 'ringan'),
  ('pr-05', 'PR-05', 'Menghalangi Akses Jalan Publik / Parkir Sembarangan', 4000, 0, 'ringan'),
  ('pr-06', 'PR-06', 'Melakukan Perusakan Ringan pada Fasilitas Publik', 6000, 1, 'ringan'),
  ('pr-07', 'PR-07', 'Merokok di Area Terlarang atau Dekat Pom Bensin', 1500, 0, 'ringan'),
  ('pr-08', 'PR-08', 'Melakukan Provokasi Massa / Menyebarkan Berita Provokatif', 8000, 1, 'ringan'),
  ('pr-09', 'PR-09', 'Pencemaran Nama Baik Warga Kota Melalui Media', 7500, 1, 'ringan'),
  ('pr-10', 'PR-10', 'Memasuki Area Terlarang / Area Militer Tanpa Izin', 5000, 1, 'ringan'),
  ('pm-01', 'PM-01', 'Pencarian / Pencurian Skala Kecil (Toko / Rumah)', 10000, 2, 'menengah'),
  ('pm-02', 'PM-02', 'Penganiayaan Ringan Tanpa Senjata Terhadap Warga', 12500, 2, 'menengah'),
  ('pm-03', 'PM-03', 'Penipuan Transaksi Publik / Jual Beli Bodong', 15000, 3, 'menengah'),
  ('pm-04', 'PM-04', 'Membawa Senjata Tajam di Ruang Publik Tanpa Izin Kerja', 18000, 3, 'menengah'),
  ('pm-05', 'PM-05', 'Mencoba Menyuap Petugas Kepolisian / Aparat Hukum', 25000, 4, 'menengah'),
  ('pm-06', 'PM-06', 'Sengaja Merusak Properti Milik Warga Lain', 14000, 2, 'menengah'),
  ('pm-07', 'PM-07', 'Pemerasan / Intimidasi Finansial Terhadap Korban', 16500, 3, 'menengah'),
  ('pm-08', 'PM-08', 'Tabrak Lari yang Mengakibatkan Kerusakan Properti', 22000, 4, 'menengah'),
  ('pm-09', 'PM-09', 'Kepemilikan dan Konsumsi Narkoba Dosis Kecil', 20000, 3, 'menengah'),
  ('pm-10', 'PM-10', 'Sengaja Menghalangi Tugas Penyidikan / Menghapus Bukti', 15000, 2, 'menengah'),
  ('pb-01', 'PB-01', 'Pembunuhan Berencana Terhadap Warga Sipil', 100000, 24, 'berat'),
  ('pb-02', 'PB-02', 'Melakukan Perampokan Bank Utama / Toko Emas', 80000, 18, 'berat'),
  ('pb-03', 'PB-03', 'Membawa atau Menyimpan Senjata Api Ilegal Kelas Militer', 50000, 12, 'berat'),
  ('pb-04', 'PB-04', 'Penyerangan Bersenjata Terhadap Markas Kepolisian', 75000, 15, 'berat'),
  ('pb-05', 'PB-05', 'Perdagangan / Menjadi Bandar Narkoba Skala Besar', 90000, 20, 'berat'),
  ('pb-06', 'PB-06', 'Penyanderaan Warga Negara Menggunakan Senjata', 60000, 12, 'berat'),
  ('pb-07', 'PB-07', 'Melakukan Makar Terhadap Instansi Pemerintah Kota', 120000, 30, 'berat'),
  ('pb-08', 'PB-08', 'Aksi Terorisme / Peledakan Bom di Tempat Umum', 150000, 36, 'berat'),
  ('pb-09', 'PB-09', 'Pembunuhan Terhadap Petugas Kepolisian saat Bertugas', 120000, 24, 'berat'),
  ('pb-10', 'PB-10', 'Tindakan Korupsi Keuangan Daerah / Suap Skala Besar', 85000, 16, 'berat')
ON CONFLICT (id) DO NOTHING;

-- Seed reports
INSERT INTO reports (id, timestamp, citizen_name, articles, total_fine, total_jail_time, type) VALUES
  ('rep-1', '2026-06-23T08:15:00-07:00', 'Budi Santoso', ARRAY['sl-01', 'sl-05', 'sl-06'], 12500, 0, 'lalu_lintas'),
  ('rep-2', '2026-06-22T21:40:00-07:00', 'Michael Corleone', ARRAY['pm-04', 'pm-05'], 43000, 7, 'kriminal'),
  ('rep-3', '2026-06-21T14:30:00-07:00', 'Jessica Alva', ARRAY['sl-08', 'sl-03'], 23500, 2, 'lalu_lintas')
ON CONFLICT (id) DO NOTHING;
