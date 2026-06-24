// Toast notification messages - Themed for Portal Regulasi
// All messages use consistent terminology aligned with inflation dashboard

export const TOAST_MESSAGES = {
  // Regulation Management
  REGULATION_ADDED: (code: string) => `[✓] PASAL ${code} TERDAFTAR DALAM SISTEM`,
  REGULATION_UPDATED: (code: string) => `[⟳] PASAL ${code} TERSINKRONISASI`,
  REGULATION_DELETED: (code: string) => `[✗] PASAL ${code} DIHAPUS DARI SISTEM`,

  // Inflation / Price Adjustment
  INFLATION_APPLIED: (percent: number) => `[⬆] PENYESUAIAN HARGA +${percent}% DITERAPKAN GLOBAL`,
  INFLATION_SUCCESS: (percent: number) => `[📈] INFLASI: SEMUA DENDA NAIK +${percent}% - SINKRONISASI SELESAI`,
  INFLATION_TOTAL: (total: number, period: string) => `[💰] TOTAL DENDA ${period}: Rp${total.toLocaleString('id-ID')}`,

  // Report Management
  REPORT_SAVED: `[📝] LAPORAN BERHASIL DICATAT DAN DISIMPAN KE DATABASE`,
  REPORT_DELETED: `[✗] DATA LAPORAN DIHAPUS DARI SISTEM`,
  REPORT_CONFIRMED: `[✓] LAPORAN DIKONFIRMASI - TERSIMPAN KE ARSIP KRIMINAL`,

  // Dashboard
  DASHBOARD_UNLOCKED: `[🔓] DASHBOARD ADMIN BERHASIL DIBUKA - SESSION AKTIF 24 JAM`,
  DASHBOARD_LOCKED: `[🔒] DASHBOARD DITUTUP - AKSES DIKUNCI`,

  // Calculator
  CALCULATOR_CLEARED: `[⊘] KALKULATOR DIRESET - DATA PAJAK DIHAPUS`,
  CALCULATOR_ADDED: (code: string) => `[✚] PASAL ${code} DITAMBAH KE KALKULATOR PAJAK`,
  CALCULATOR_REMOVED: (code: string) => `[✖] PASAL ${code} DIHAPUS DARI KALKULATOR`,

  // Status & Sync
  DATA_SYNCED: `[⟳] DATA TERSINKRONISASI KE SERVER - SEMUA PERUBAHAN TERCATAT`,
  OFFLINE_MODE: `[📡] MODE OFFLINE: PERUBAHAN AKAN DISINKRONKAN SAAT KONEKSI PULIH`,
  
  // Errors
  INVALID_INPUT: `[!] INPUT TIDAK VALID - PERIKSA KEMBALI DATA YANG ANDA MASUKKAN`,
  OPERATION_FAILED: `[✗] OPERASI GAGAL - COBA LAGI ATAU HUBUNGI ADMINISTRATOR`,
  NO_INTERNET: `[📡] KONEKSI TERPUTUS - MENGGUNAKAN DATA LOKAL TERSIMPAN`,
} as const;

export const TOAST_TYPES = {
  SUCCESS: 'success' as const,
  WARNING: 'warning' as const,
  ERROR: 'error' as const,
  INFO: 'info' as const,
} as const;

export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];
