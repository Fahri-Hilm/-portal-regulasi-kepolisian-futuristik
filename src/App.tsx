import React, { useState, useEffect, useCallback, Suspense, lazy, memo } from 'react';
import { Regulation, IncidentReport } from './types';
import { INITIAL_REGULATIONS, INITIAL_REPORTS } from './data';
import { Logo } from './components/Logo';
import { ToastContainer, Toast } from './components/Toast';
import { VideoBackground } from './components/VideoBackground';
import { useAdaptivePerformance } from './contexts/AdaptivePerformanceContext';
import {
  fetchRegulations, insertRegulation, updateRegulation, deleteRegulation,
  fetchReports, insertReport, deleteReport,
  subscribeToChanges, isSupabaseConfigured, batchUpdateRegulations,
} from './lib/database';

const ClockDisplay = memo(function ClockDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-slate-900/30 border border-cyan-950/60 rounded px-2 sm:px-2.5 py-1 sm:py-1.5 font-mono shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] shrink-0">
      <ClockIcon className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
      <div className="text-right">
        <span className="text-cyan-400 font-bold tracking-wider block text-[10px] sm:text-xs leading-none">
          {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-[7px] sm:text-[8px] text-slate-500 block leading-none mt-0.5 uppercase hidden sm:block">
          {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
});

const RegulationView = lazy(() => import('./components/RegulationView').then(m => ({ default: m.RegulationView })));
const DashboardView = lazy(() => import('./components/DashboardView').then(m => ({ default: m.DashboardView })));
const ReportView = lazy(() => import('./components/ReportView').then(m => ({ default: m.ReportView })));
const DocumentationView = lazy(() => import('./components/DocumentationView').then(m => ({ default: m.DocumentationView })));

import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  Clock as ClockIcon,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { config, isLowEnd } = useAdaptivePerformance();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'regulasi' | 'laporan' | 'dokumentasi' | null>(null);

  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(() => {
    const saved = localStorage.getItem('pkr_dashboard_unlocked');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.expiry && Date.now() < data.expiry) return true;
    }
    return false;
  });
  const [showDashboardPassword, setShowDashboardPassword] = useState(false);
  const [dashboardPasswordInput, setDashboardPasswordInput] = useState('');
  const [dashboardPassError, setDashboardPassError] = useState('');

  const [regulations, setRegulations] = useState<Regulation[]>(() => {
    const saved = localStorage.getItem('pkr_regulations');
    return saved ? JSON.parse(saved) : INITIAL_REGULATIONS;
  });

  const [reports, setReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('pkr_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [selectedRegulations, setSelectedRegulations] = useState<Regulation[]>(() => {
    const saved = localStorage.getItem('pkr_calculator');
    return saved ? JSON.parse(saved) : [];
  });

  const [inflationPercent, setInflationPercent] = useState<number>(() => {
    const saved = localStorage.getItem('pkr_inflation_percent');
    return saved ? JSON.parse(saved) : 0;
  });

  // Toast system
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load data from Supabase on mount (with localStorage fallback)
  useEffect(() => {
    async function loadData() {
      const [regs, reps] = await Promise.all([fetchRegulations(), fetchReports()]);
      setRegulations(regs);
      setReports(reps);
    }
    loadData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const unsubscribe = subscribeToChanges(async () => {
      const [regs, reps] = await Promise.all([fetchRegulations(), fetchReports()]);
      setRegulations(regs);
      setReports(reps);
    });

    return unsubscribe;
  }, []);

  // Sync to localStorage as offline backup
  useEffect(() => {
    localStorage.setItem('pkr_regulations', JSON.stringify(regulations));
  }, [regulations]);

  useEffect(() => {
    localStorage.setItem('pkr_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('pkr_calculator', JSON.stringify(selectedRegulations));
  }, [selectedRegulations]);

  const handleAddRegulation = async (newReg: Regulation) => {
    setRegulations((prev) => [newReg, ...prev]);
    await insertRegulation(newReg);
    addToast(`[✓] PASAL ${newReg.code} TERDAFTAR DALAM SISTEM`, 'success');
  };

  const handleEditRegulation = async (updatedReg: Regulation) => {
    setRegulations((prev) => prev.map((r) => (r.id === updatedReg.id ? updatedReg : r)));
    setSelectedRegulations((prev) => prev.map((r) => (r.id === updatedReg.id ? updatedReg : r)));
    await updateRegulation(updatedReg);
    addToast(`[⟳] PASAL ${updatedReg.code} TERSINKRONISASI`, 'success');
  };

  const handleDeleteRegulation = async (id: string) => {
    const reg = regulations.find((r) => r.id === id);
    if (window.confirm('Apakah Anda yakin ingin menghapus pasal ini secara permanen?')) {
      setRegulations((prev) => prev.filter((r) => r.id !== id));
      setSelectedRegulations((prev) => prev.filter((r) => r.id !== id));
      await deleteRegulation(id);
      addToast(`[✗] PASAL ${reg?.code || ''} DIHAPUS DARI SISTEM`, 'warning');
    }
  };

  const handleAddReport = async (newReport: IncidentReport) => {
    setReports((prev) => [newReport, ...prev]);
    await insertReport(newReport);
    addToast('[📝] LAPORAN BERHASIL DICATAT DAN DISIMPAN KE DATABASE', 'success');
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Hapus riwayat laporan ini?')) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      await deleteReport(id);
      addToast('[✗] DATA LAPORAN DIHAPUS DARI SISTEM', 'warning');
    }
  };

  const handleAddRegToCalculator = (reg: Regulation) => {
    if (!selectedRegulations.some((r) => r.id === reg.id)) {
      setSelectedRegulations((prev) => [...prev, reg]);
    }
  };

  const handleRemoveRegFromCalculator = (reg: Regulation) => {
    setSelectedRegulations((prev) => prev.filter((r) => r.id !== reg.id));
  };

  const handleResetCalculator = () => {
    setSelectedRegulations([]);
  };

  const handleApplyInflation = async (percent: number) => {
    if (window.confirm(`Yakin ingin menyesuaikan semua denda sebesar ${percent}%?`)) {
      const multiplier = 1 + percent / 100;
      const updated = regulations.map((r) => ({
        ...r,
        fine: Math.round(r.fine * multiplier),
      }));
      setRegulations(updated);
      setSelectedRegulations((prev) =>
        prev.map((r) => {
          const u = updated.find((ur) => ur.id === r.id);
          return u || r;
        })
      );
      setInflationPercent(percent);
      localStorage.setItem('pkr_inflation_percent', JSON.stringify(percent));
      await batchUpdateRegulations(updated);
      addToast(`[📈] INFLASI: SEMUA DENDA NAIK +${percent}% - SINKRONISASI SELESAI`, 'success');
    }
  };

  const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || 'ADMIN2026';

  const handleDashboardUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (dashboardPasswordInput.trim().toUpperCase() === DASHBOARD_PASSWORD) {
      setIsDashboardUnlocked(true);
      setShowDashboardPassword(false);
      setDashboardPasswordInput('');
      setDashboardPassError('');
      localStorage.setItem('pkr_dashboard_unlocked', JSON.stringify({ expiry: Date.now() + 24 * 60 * 60 * 1000 }));
      setActiveTab('dashboard');
      addToast('[🔓] DASHBOARD ADMIN BERHASIL DIBUKA - SESSION AKTIF 24 JAM', 'success');
    } else {
      setDashboardPassError('PASSWORD SALAH! AKSES DITOLAK.');
    }
  };

  const handleDashboardTabClick = () => {
    if (!isDashboardUnlocked) {
      setShowDashboardPassword(true);
      setDashboardPasswordInput('');
      setDashboardPassError('');
    } else {
      setActiveTab('dashboard');
    }
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, onClick: handleDashboardTabClick, isActive: activeTab === 'dashboard' && isDashboardUnlocked },
    { id: 'regulasi' as const, label: 'Regulasi', icon: BookOpen, onClick: () => setActiveTab('regulasi'), isActive: activeTab === 'regulasi' },
    { id: 'laporan' as const, label: 'Laporan', icon: FileSpreadsheet, onClick: () => setActiveTab('laporan'), isActive: activeTab === 'laporan' },
    { id: 'dokumentasi' as const, label: 'Dokumentasi', icon: HelpCircle, onClick: () => setActiveTab('dokumentasi'), isActive: activeTab === 'dokumentasi' },
  ];

  return (
    <div className={`h-screen bg-slate-950 text-slate-100 flex flex-col relative select-none overflow-hidden ${config.enableScanlines ? 'scanline' : ''}`}>
      {/* Background layers */}
      <VideoBackground src="/Video_background_polisi_RP_202606240209.mp4" />

      {/* Ambient glow orbs (disabled on low-end) */}
      {!isLowEnd && config.enableFloat && (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none z-0 float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none z-0 float-medium" />
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Lock Screen */}
      {/* Dashboard Password Modal */}
      <AnimatePresence>
        {showDashboardPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={() => setShowDashboardPassword(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-slate-950/90 border border-cyan-500/40 rounded-xl p-5 sm:p-6 shadow-[0_0_30px_rgba(6,182,212,0.25)] z-10 backdrop-blur-sm"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500 rounded-t-xl" />
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                </motion.div>
                <h3 className="text-cyan-400 font-display font-bold text-xs tracking-widest uppercase">AKSES DASHBOARD</h3>
                <p className="text-slate-500 text-[10px] font-sans mt-1">Masukkan password admin untuk mengakses dashboard.</p>
              </div>

              {dashboardPassError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  {dashboardPassError}
                </motion.div>
              )}

              <form onSubmit={handleDashboardUnlock} className="space-y-3">
                <input
                  type="password"
                  placeholder="Masukkan password..."
                  value={dashboardPasswordInput}
                  onChange={(e) => { setDashboardPasswordInput(e.target.value); setDashboardPassError(''); }}
                  className="w-full bg-slate-900 border border-cyan-950 rounded p-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 font-mono text-center tracking-widest transition-all"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDashboardPassword(false)}
                    className="px-3 py-2 bg-slate-900 border border-cyan-950 hover:bg-slate-800 text-slate-400 text-[10px] font-mono rounded cursor-pointer transition-all"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg cursor-pointer transition-all hover-bounce"
                  >
                    UNLOCK
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App */}
      <div className="flex-1 flex flex-col relative z-10 min-h-0">
          {/* Header - responsive */}
          <header className="border-b border-cyan-950/60 bg-slate-950/70 backdrop-blur-md px-3 sm:px-4 py-2 relative shrink-0">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Logo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-slate-100 font-display font-black text-sm sm:text-base md:text-lg tracking-wider leading-none truncate">
                    PORTAL REGULASI KEPOLISIAN.
                  </h1>
                  <p className="text-cyan-400 font-sans text-[9px] sm:text-[10px] tracking-wide font-medium mt-0.5 uppercase hidden sm:block">
                    Undang-Undang & Pasal Regulasi Kota
                  </p>
                  <p className="text-[7px] sm:text-[8px] md:text-[9px] font-mono text-cyan-500/40 mt-px uppercase tracking-wider whitespace-nowrap truncate">
                    Created By Fanzy AKA. Fajuu
                  </p>
                </div>
              </div>
              <ClockDisplay />
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-3 py-2 flex flex-col lg:flex-row gap-2 sm:gap-3 items-stretch min-h-0">
            {/* Desktop Sidebar Nav */}
            <nav className="hidden lg:flex flex-col gap-1 w-44 shrink-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                    item.isActive
                      ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] pulse-glow'
                      : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/30 hover:border-cyan-950/40'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </button>
              ))}

              <div className="h-px bg-cyan-950/40 my-2" />

              {/* Tips Cepat */}
              <div className="bg-slate-950/60 border border-cyan-950/40 rounded-lg p-2.5 mt-auto">
                <p className="text-cyan-400 font-display font-bold text-[9px] uppercase tracking-widest mb-1.5">Tips Cepat</p>
                <div className="space-y-1.5 text-[8px] sm:text-[9px] text-slate-500 font-sans leading-relaxed">
                  <p>1. Buka <span className="text-cyan-400">Regulasi</span> → pilih pasal</p>
                  <p>2. Klik <span className="text-cyan-400">Tambah</span> ke kalkulator</p>
                  <p>3. <span className="text-cyan-400">Konfirmasi</span> → masukkan nama</p>
                  <p>4. Laporan otomatis tersimpan</p>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 bg-slate-900/20 border border-cyan-950/50 rounded-xl p-2.5 sm:p-3 relative shadow-inner overflow-y-auto overflow-x-hidden min-h-0 compact-scrollbar lg:pb-0 pb-[72px]">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

              {/* LANDING PAGE */}
              {activeTab === null && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: config.enableAnimations ? 0.6 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center"
                  >
                    <Logo className="w-20 h-20 sm:w-24 sm:h-24 mb-4" glow />

                    <h1
                      className={`glitch-title text-cyan-400 font-display font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase leading-none mb-1 ${!config.enableGlitch ? 'no-glitch' : ''}`}
                      data-text="PORTAL REGULASI"
                    >
                      PORTAL REGULASI
                    </h1>
                    <h2 className="text-cyan-300/60 font-display font-bold text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mb-2">
                      KEPOLISIAN FUTURISTIK
                    </h2>

                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent mb-2" />

                    <p className="text-slate-500 font-sans text-[9px] sm:text-[10px] max-w-xs leading-relaxed mb-4">
                      Sistem manajemen regulasi dan laporan kepolisian berbasis teknologi digital.
                      <br />
                      <span className="text-cyan-500/60">Undang-Undang & Pasal Regulasi Kota</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <button
                        onClick={() => setActiveTab('regulasi')}
                        className="group flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 hover:border-cyan-400/60 text-cyan-400 font-display font-bold text-[10px] sm:text-xs uppercase tracking-widest px-5 py-2 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer"
                      >
                        Mulai
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => setActiveTab('dokumentasi')}
                        className="flex items-center gap-2 bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/40 hover:border-slate-600/40 text-slate-400 hover:text-slate-300 font-display font-bold text-[10px] sm:text-xs uppercase tracking-widest px-5 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        Panduan
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[7px] sm:text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
                        v1.0
                      </span>
                      <span>|</span>
                      <span>{regulations.length} Pasal</span>
                      <span>|</span>
                      <span>{reports.length} Laporan</span>
                    </div>

                    {/* Developer Credit */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent" />
                      <p className="text-cyan-500/30 font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.4em]">
                        Developed by
                      </p>
                      <p className="text-cyan-400/50 font-display font-black text-[10px] sm:text-xs tracking-wider uppercase whitespace-nowrap">
                        Fanzy AKA. Fajuu
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* TAB CONTENT */}
              {activeTab !== null && (
              <AnimatePresence>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: config.enableAnimations ? 0.15 : 0, ease: 'easeOut' }}
                  className="h-full"
                >
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><span className="text-cyan-400 text-xs font-mono animate-pulse">MEMUAT...</span></div>}>
                  {activeTab === 'dashboard' && isDashboardUnlocked && (
                    <DashboardView
                      regulations={regulations}
                      reports={reports}
                      onAddRegulation={handleAddRegulation}
                      onEditRegulation={handleEditRegulation}
                      onDeleteRegulation={handleDeleteRegulation}
                      onApplyInflation={handleApplyInflation}
                      inflationPercent={inflationPercent}
                    />
                  )}

                  {activeTab === 'dashboard' && !isDashboardUnlocked && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <ShieldAlert className="w-12 h-12 text-amber-400/50 mb-3" />
                      <h3 className="text-cyan-400 font-display font-bold text-sm tracking-widest uppercase mb-2">DASHBOARD TERKUNCI</h3>
                      <p className="text-slate-500 text-xs mb-4">Masukkan password admin untuk mengakses dashboard.</p>
                      <button
                        onClick={() => setShowDashboardPassword(true)}
                        className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-display font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition-all cursor-pointer"
                      >
                        BUKA DASHBOARD
                      </button>
                    </div>
                  )}

                  {activeTab === 'regulasi' && (
                    <RegulationView
                      regulations={regulations}
                      selectedRegulations={selectedRegulations}
                      reports={reports}
                      onAddRegulation={handleAddRegToCalculator}
                      onRemoveRegulation={handleRemoveRegFromCalculator}
                      onResetCalculator={handleResetCalculator}
                      onConfirmCalculator={(suspectName) => {
                        const totalFine = selectedRegulations.reduce((s, r) => s + r.fine, 0);
                        const totalJail = selectedRegulations.reduce((s, r) => s + r.jailTime, 0);
                        const isTrafficOnly = selectedRegulations.every((r) => r.category === 'satlantas');
                        const report: IncidentReport = {
                          id: `rep-${Date.now()}`,
                          timestamp: new Date().toISOString(),
                          citizenName: suspectName,
                          articles: selectedRegulations.map((r) => r.id),
                          totalFine,
                          totalJailTime: totalJail,
                          type: isTrafficOnly ? 'lalu_lintas' : 'kriminal',
                        };
                        handleAddReport(report);
                        handleResetCalculator();
                        setActiveTab('laporan');
                      }}
                    />
                  )}

                  {activeTab === 'laporan' && (
                    <ReportView
                      reports={reports}
                      regulations={regulations}
                      onDeleteReport={handleDeleteReport}
                    />
                  )}

                  {activeTab === 'dokumentasi' && (
                    <DocumentationView />
                  )}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
              )}
            </main>
          </div>

          {/* Footer - Mobile visible, compact */}
          <footer className="lg:hidden border-t border-cyan-950/40 bg-slate-950/40 py-1 text-center text-[7px] font-sans text-slate-500 relative shrink-0">
            <div className="max-w-7xl mx-auto px-2 flex flex-col items-center justify-center gap-0.5">
              <span>© 2026 Futuristik Roleplay</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-cyan-500/40 font-mono text-[6px] tracking-wider uppercase">
                  Fanzy AKA. Fajuu
                </span>
                <span className="text-cyan-400/40 font-mono text-[7px] tracking-widest uppercase">
                  PANEL CODE v10
                </span>
              </div>
            </div>
          </footer>

          {/* Desktop Footer */}
          <footer className="hidden lg:block border-t border-cyan-950/40 bg-slate-950/40 py-1.5 text-center text-[10px] font-sans text-slate-600 relative shrink-0">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>© 2026 Futuristik Roleplay. All Rights Reserved.</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-500/40 font-mono text-[8px] tracking-wider uppercase whitespace-nowrap">
                  Fanzy AKA. Fajuu
                </span>
                <span className="text-[9px] text-cyan-400/40 font-mono tracking-widest uppercase">
                  PANEL CODE v10
                </span>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Nav - Compact & Efficient */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-cyan-950/60 bg-slate-950/95 backdrop-blur-md shrink-0 pb-[env(safe-area-inset-bottom)]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 font-display font-bold text-[7px] sm:text-[8px] uppercase tracking-wider transition-all cursor-pointer min-h-[56px] ${
                  item.isActive
                    ? 'text-cyan-300 bg-gradient-to-t from-cyan-950/50 via-cyan-900/30 to-transparent'
                    : 'text-slate-400 active:text-cyan-400'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${item.isActive ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-400'}`} />
                <span className="truncate max-w-[60px]">{item.label}</span>
                {item.isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-300 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            ))}
          </nav>
        </div>
    </div>
  );
}

export default AppContent;
