import React, { useState, useMemo } from 'react';
import { Regulation, RegulationCategory, IncidentReport } from '../types';
import { Search, Plus, Minus, Info, ClipboardList, Trash2, ShieldAlert, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RegulationViewProps {
  regulations: Regulation[];
  selectedRegulations: Regulation[];
  reports: IncidentReport[];
  onAddRegulation: (reg: Regulation) => void;
  onRemoveRegulation: (reg: Regulation) => void;
  onResetCalculator: () => void;
  onConfirmCalculator: (suspectName: string) => void;
}

export const RegulationView: React.FC<RegulationViewProps> = ({
  regulations,
  selectedRegulations,
  reports,
  onAddRegulation,
  onRemoveRegulation,
  onResetCalculator,
  onConfirmCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RegulationCategory | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [suspectName, setSuspectName] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const categoryCounts = useMemo(() => ({
    satlantas: regulations.filter((r) => r.category === 'satlantas').length,
    ringan: regulations.filter((r) => r.category === 'ringan').length,
    menengah: regulations.filter((r) => r.category === 'menengah').length,
    berat: regulations.filter((r) => r.category === 'berat').length,
  }), [regulations]);

  const filteredRegulations = useMemo(() => {
    return regulations.filter((reg) => {
      const matchesSearch =
        reg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? reg.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [regulations, searchQuery, selectedCategory]);

  const totalFine = useMemo(() => selectedRegulations.reduce((sum, r) => sum + r.fine, 0), [selectedRegulations]);
  const totalJailTime = useMemo(() => selectedRegulations.reduce((sum, r) => sum + r.jailTime, 0), [selectedRegulations]);

  const isTrafficOnly = useMemo(() => selectedRegulations.every((r) => r.category === 'satlantas'), [selectedRegulations]);

  // Residivist / repeat offender check
  const suspectStats = useMemo(() => {
    if (!suspectName.trim()) return null;
    const name = suspectName.trim().toLowerCase();
    const previousReports = reports.filter((r) => r.citizenName.toLowerCase() === name);
    const trafficReports = previousReports.filter((r) => r.type === 'lalu_lintas');
    const criminalReports = previousReports.filter((r) => r.type === 'kriminal');

    const relevantReports = isTrafficOnly ? trafficReports : criminalReports;
    const totalTimesCaught = relevantReports.length;
    const totalJailServed = relevantReports.reduce((sum, r) => sum + r.totalJailTime, 0);
    const totalFinesOwed = relevantReports.reduce((sum, r) => sum + r.totalFine, 0);
    const previousArticles = relevantReports.flatMap((r) =>
      r.articles.map((aid) => regulations.find((reg) => reg.id === aid)?.code).filter(Boolean)
    );

    return {
      isFlagged: totalTimesCaught > 0,
      totalTimesCaught,
      totalJailServed,
      totalFinesOwed,
      previousArticles,
      allPreviousCount: previousReports.length,
    };
  }, [suspectName, reports, regulations, isTrafficOnly]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  const handleCategoryClick = (category: RegulationCategory) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleCloseAllMenu = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleOpenConfirm = () => {
    setConfirmError('');
    setSuspectName('');
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    if (!suspectName.trim()) {
      setConfirmError('Nama tersangka wajib diisi!');
      return;
    }
    onConfirmCalculator(suspectName.trim());
    setShowConfirmModal(false);
    setSuspectName('');
  };

  const categoryCard = (cat: RegulationCategory, title: string, subtitle: string, code: string, color: string) => (
    <button
      onClick={() => handleCategoryClick(cat)}
      className={`text-left p-2.5 rounded-lg transition-all duration-300 relative overflow-hidden group border ${
        selectedCategory === cat
          ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
          : 'bg-slate-900/60 border-cyan-950 hover:border-cyan-500/50'
      }`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 blur-2xl rounded-full group-hover:scale-150 transition-all duration-500" />
      <h3 className="text-cyan-400 font-display font-bold text-[10px] tracking-widest mb-0.5 truncate">{title}</h3>
      <p className="text-slate-400 text-[9px] font-sans mb-1.5">{subtitle}</p>
      <div className="flex justify-between items-center">
        <span className="text-slate-500 text-[9px] font-mono">KATEGORI: {code}</span>
        <span className={`${color} text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border`}>
          {categoryCounts[cat]} PASAL
        </span>
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
      <div className="lg:col-span-8 flex flex-col space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kode pasal atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-cyan-500/30 rounded-lg py-2 pl-3 pr-10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-sans text-xs shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 w-4 h-4 pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categoryCard('satlantas', 'UNDANG UNDANG SATLANTAS', '(METRO / POLANTAS)', 'SL', 'bg-cyan-500/10 border-cyan-400/20 text-cyan-400')}
          {categoryCard('ringan', 'UNDANG-UNDANG KEPOLISIAN', '(PASAL RINGAN)', 'RINGAN', 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400')}
          {categoryCard('menengah', 'UNDANG-UNDANG KEPOLISIAN', '(PASAL MENENGAH)', 'MENENGAH', 'bg-amber-500/10 border-amber-400/20 text-amber-400')}
          {categoryCard('berat', 'UNDANG-UNDANG KEPOLISIAN', '(PASAL BERAT)', 'BERAT', 'bg-red-500/10 border-red-400/20 text-red-400')}
        </div>

        <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-slate-200 font-display font-bold text-xs tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              {selectedCategory ? `Pasal: ${selectedCategory.toUpperCase()}` : searchQuery ? 'Hasil Pencarian' : 'Semua Daftar Regulasi'}
            </h2>
            <span className="text-[9px] font-mono text-cyan-400/70 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/10">
              {filteredRegulations.length} Pasal
            </span>
          </div>

          <div className="space-y-1.5 max-h-[40vh] md:max-h-[300px] overflow-y-auto pr-1 compact-scrollbar">
            {filteredRegulations.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-sans">
                <Info className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-cyan-400" />
                <span className="text-xs">Tidak ada pasal yang sesuai.</span>
              </div>
            ) : (
              filteredRegulations.map((reg) => {
                const isSelected = selectedRegulations.some((r) => r.id === reg.id);
                return (
                  <motion.div
                    layout
                    key={reg.id}
                    className={`p-2.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-2 transition-all duration-300 ${
                      isSelected
                        ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        : 'bg-slate-900/40 border-cyan-950 hover:bg-slate-900/70 hover:border-cyan-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border select-none shrink-0 tracking-wide text-center min-w-[55px] ${
                        reg.category === 'satlantas' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                        : reg.category === 'ringan' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : reg.category === 'menengah' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {reg.code}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-slate-200 font-sans font-medium text-xs leading-snug truncate">{reg.description}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-[9px] font-mono text-slate-500">
                          <span>Denda: <strong className="text-cyan-400/80 font-semibold">{formatCurrency(reg.fine)}</strong></span>
                          <span>Kurungan: <strong className="text-slate-400 font-semibold">{reg.jailTime === 0 ? '0 Bulan' : `${reg.jailTime} Bulan`}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end md:justify-center shrink-0">
                      {isSelected ? (
                        <button 
                          onClick={() => {
                            if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
                            onRemoveRegulation(reg);
                          }} 
                          className="flex items-center gap-1 px-2 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 text-[9px] font-mono border border-red-500/30 rounded transition-all cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />HAPUS
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                            onAddRegulation(reg);
                          }} 
                          className="flex items-center gap-1 px-2 py-1 bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-400 text-[9px] font-mono border border-cyan-500/30 rounded transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />TAMBAH
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Calculator Panel */}
      <div className="lg:col-span-4 bg-slate-950/60 border border-cyan-950/80 rounded-lg p-3 flex flex-col space-y-3 relative overflow-hidden shadow-2xl lg:sticky lg:top-2">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />

        <div>
          <h2 className="text-cyan-400 font-display font-bold text-xs tracking-widest neon-text-glow flex items-center gap-1.5 mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            KALKULATOR DENDA & HUKUMAN
          </h2>
          <div className="space-y-2 bg-slate-900/40 p-2.5 rounded-lg border border-cyan-950">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 text-[10px]">Total Denda:</span>
              <span className="text-cyan-400 font-mono font-bold text-sm neon-text-glow">{formatCurrency(totalFine)}</span>
            </div>
            <div className="h-px bg-cyan-950" />
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400 text-[10px]">Total Hukuman Kurungan:</span>
              <span className="text-slate-200 font-mono font-bold text-sm">{totalJailTime} Bulan</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-slate-400 font-display font-semibold text-[9px] tracking-wider uppercase mb-2">
            Daftar Pasal Terpilih ({selectedRegulations.length})
          </h3>
          <div className="bg-slate-900/20 border border-cyan-950 rounded-lg max-h-[100px] lg:max-h-[120px] overflow-y-auto p-1.5 space-y-1 compact-scrollbar">
            {selectedRegulations.length === 0 ? (
              <div className="text-center py-6 text-slate-600 text-[10px] font-sans italic">Belum ada pasal yang dipilih</div>
            ) : (
              <AnimatePresence>
                {selectedRegulations.map((reg) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key={`calc-${reg.id}`}
                    className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded border border-cyan-950/50 hover:border-cyan-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden mr-1.5">
                      <span className="text-[8px] font-mono font-bold px-1 py-px rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">{reg.code}</span>
                      <span className="text-[9px] text-slate-300 font-sans truncate">{reg.description}</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
                        onRemoveRegulation(reg);
                      }} 
                      className="text-slate-500 hover:text-red-400 p-0.5 shrink-0 transition-colors" 
                      title="Hapus"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
              handleOpenConfirm();
            }}
            disabled={selectedRegulations.length === 0}
            className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-950/20 disabled:text-cyan-900/60 disabled:shadow-none font-display font-bold text-[10px] uppercase tracking-widest text-slate-950 py-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            KONFIRMASI HITUNG
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
              onResetCalculator();
            }}
            disabled={selectedRegulations.length === 0}
            className="w-full bg-red-950/20 hover:bg-red-900/20 text-red-400 border border-red-500/30 hover:border-red-500/60 disabled:bg-cyan-950/10 disabled:text-cyan-900/40 disabled:border-cyan-950 font-display font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            RESET KALKULATOR
          </button>
        </div>
      </div>

      {/* Confirm Modal with Residivist Detection */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.25)] z-10"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500 rounded-t-xl" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 font-display font-bold text-xs tracking-widest uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  KONFIRMASI PELANGGARAN
                </h3>
                <button onClick={() => setShowConfirmModal(false)} className="p-0.5 text-slate-500 hover:text-slate-200 rounded-full hover:bg-slate-900 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {confirmError && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] flex items-center gap-1.5">
                  <Info className="w-3 h-3 shrink-0" />
                  {confirmError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-[10px] font-display font-semibold uppercase tracking-wider mb-1">
                    Nama Tersangka / Warga <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Alexander Pierce"
                    value={suspectName}
                    onChange={(e) => setSuspectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmSubmit()}
                    className="w-full bg-slate-900 border border-cyan-950 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                    autoFocus
                  />
                </div>

                {/* REPEAT OFFENDER ALERT */}
                <AnimatePresence>
                  {suspectStats?.isFlagged && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.8 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0.8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-amber-400 font-display font-bold text-[10px] uppercase tracking-wider">
                            {isTrafficOnly ? 'WARGA INI PERNAH DITILANG' : 'SUSPECT RESIDIVIS'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-slate-950/40 rounded p-1.5 border border-amber-500/20">
                            <span className="text-amber-400 font-mono font-bold text-sm block">{suspectStats.totalTimesCaught}</span>
                            <span className="text-[8px] text-slate-500 uppercase">{isTrafficOnly ? 'Kali Ditilang' : 'Kali Ditangkap'}</span>
                          </div>
                          <div className="bg-slate-950/40 rounded p-1.5 border border-amber-500/20">
                            <span className="text-amber-400 font-mono font-bold text-sm block">{suspectStats.totalJailServed} Bln</span>
                            <span className="text-[8px] text-slate-500 uppercase">Total Penjara</span>
                          </div>
                          <div className="bg-slate-950/40 rounded p-1.5 border border-amber-500/20">
                            <span className="text-amber-400 font-mono font-bold text-sm block">{formatCurrency(suspectStats.totalFinesOwed)}</span>
                            <span className="text-[8px] text-slate-500 uppercase">Total Denda</span>
                          </div>
                        </div>

                        {suspectStats.previousArticles.length > 0 && (
                          <div className="text-[9px]">
                            <span className="text-slate-500 block mb-1">{isTrafficOnly ? 'Pelanggaran sebelumnya:' : 'Pasal sebelumnya:'}</span>
                            <div className="flex flex-wrap gap-1">
                              {suspectStats.previousArticles.map((code, i) => (
                                <span key={i} className="text-amber-400/80 font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                  {code}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-slate-900/40 border border-cyan-950 rounded-lg p-2.5 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Jumlah Pasal:</span>
                    <span className="text-cyan-400 font-mono font-bold">{selectedRegulations.length} pasal</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Total Denda:</span>
                    <span className="text-cyan-400 font-mono font-bold neon-text-glow">{formatCurrency(totalFine)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Total Kurungan:</span>
                    <span className="text-slate-200 font-mono font-bold">{totalJailTime} Bulan</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-3 py-2 bg-slate-900 border border-cyan-950 hover:bg-slate-800 text-slate-400 text-[10px] font-mono rounded cursor-pointer"
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    CATAT & KIRIM KE LAPORAN
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
