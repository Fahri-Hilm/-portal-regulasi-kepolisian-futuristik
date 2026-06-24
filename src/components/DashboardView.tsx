import React, { useState, useMemo } from 'react';
import { Regulation, RegulationCategory, IncidentReport } from '../types';
import { Plus, Edit2, Trash2, X, PieChart, BarChart3, Database, Save, FileText, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  regulations: Regulation[];
  reports: IncidentReport[];
  onAddRegulation: (newReg: Regulation) => void;
  onEditRegulation: (updatedReg: Regulation) => void;
  onDeleteRegulation: (id: string) => void;
  onApplyInflation: (percent: number) => void;
  inflationPercent: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  regulations,
  reports,
  onAddRegulation,
  onEditRegulation,
  onDeleteRegulation,
  onApplyInflation,
  inflationPercent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFine, setFormFine] = useState('');
  const [formJailTime, setFormJailTime] = useState('');
  const [formCategory, setFormCategory] = useState<RegulationCategory>('satlantas');
  const [formError, setFormError] = useState('');
  const [inflationInput, setInflationInput] = useState('');
  const [chartMode, setChartMode] = useState<'day' | 'week' | 'month'>('day');

  const stats = useMemo(() => {
    const total = regulations.length;
    if (total === 0) return { satlantas: 0, ringan: 0, menengah: 0, berat: 0, total: 0, counts: { satlantas: 0, ringan: 0, menengah: 0, berat: 0 } };
    const counts = {
      satlantas: regulations.filter((r) => r.category === 'satlantas').length,
      ringan: regulations.filter((r) => r.category === 'ringan').length,
      menengah: regulations.filter((r) => r.category === 'menengah').length,
      berat: regulations.filter((r) => r.category === 'berat').length,
    };
    return {
      satlantas: Math.round((counts.satlantas / total) * 100),
      ringan: Math.round((counts.ringan / total) * 100),
      menengah: Math.round((counts.menengah / total) * 100),
      berat: Math.round((counts.berat / total) * 100),
      total,
      counts,
    };
  }, [regulations]);

  // Real data from reports - grouped by day/week/month
  const reportStats = useMemo(() => {
    const now = new Date();

    if (chartMode === 'day') {
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const counts = new Array(7).fill(0);
      const fines = new Array(7).fill(0);
      reports.forEach((r) => {
        const day = new Date(r.timestamp).getDay();
        counts[day]++;
        fines[day] += r.totalFine;
      });
      return days.map((label, i) => ({ label, count: counts[i], fine: fines[i] }));
    }

    if (chartMode === 'week') {
      const weeks: { label: string; count: number; fine: number }[] = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        const label = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
        let count = 0;
        let fine = 0;
        reports.forEach((r) => {
          const d = new Date(r.timestamp);
          if (d >= weekStart && d <= weekEnd) { count++; fine += r.totalFine; }
        });
        weeks.push({ label, count, fine });
      }
      return weeks;
    }

    // month mode
    const months: { label: string; count: number; fine: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = monthNames[m.getMonth()];
      let count = 0;
      let fine = 0;
      reports.forEach((r) => {
        const d = new Date(r.timestamp);
        if (d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear()) {
          count++;
          fine += r.totalFine;
        }
      });
      months.push({ label, count, fine });
    }
    return months;
  }, [reports, chartMode]);

  const maxReportCount = useMemo(() => Math.max(...reportStats.map((d) => d.count), 1), [reportStats]);

  // Total denda for current chart mode
  const totalDenda = useMemo(() => reportStats.reduce((sum, d) => sum + d.fine, 0), [reportStats]);

  // Crime rate comparison (current vs previous period) - separated by type
  const crimeRate = useMemo(() => {
    const now = new Date();
    const getRate = (type: 'kriminal' | 'lalu_lintas') => {
      let currentCount = 0;
      let prevCount = 0;
      const filtered = reports.filter((r) => r.type === type);

      if (chartMode === 'day') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const midDay = new Date(today);
        midDay.setDate(today.getDate() - 3);
        filtered.forEach((r) => {
          const d = new Date(r.timestamp);
          if (d >= midDay) currentCount++;
          else if (d >= new Date(midDay.getTime() - 3 * 86400000)) prevCount++;
        });
      } else if (chartMode === 'week') {
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - now.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);
        const prevWeekStart = new Date(thisWeekStart);
        prevWeekStart.setDate(thisWeekStart.getDate() - 7);
        filtered.forEach((r) => {
          const d = new Date(r.timestamp);
          if (d >= thisWeekStart) currentCount++;
          else if (d >= prevWeekStart) prevCount++;
        });
      } else {
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        filtered.forEach((r) => {
          const d = new Date(r.timestamp);
          if (d >= thisMonth) currentCount++;
          else if (d >= prevMonth) prevCount++;
        });
      }

      // Both empty → no data
      if (prevCount === 0 && currentCount === 0) {
        return { percent: 0, direction: 'same' as const, current: 0, previous: 0, status: 'empty' as const };
      }
      // Previous empty but current has data → new activity
      if (prevCount === 0 && currentCount > 0) {
        return { percent: 0, direction: 'new' as const, current: currentCount, previous: 0, status: 'new' as const };
      }
      // Both have data → calculate percentage
      const pct = Math.round(((currentCount - prevCount) / prevCount) * 100);
      return {
        percent: Math.abs(pct),
        direction: pct > 0 ? 'up' as const : pct < 0 ? 'down' as const : 'same' as const,
        current: currentCount,
        previous: prevCount,
        status: 'active' as const,
      };
    };

    return {
      kriminal: getRate('kriminal'),
      laluLintas: getRate('lalu_lintas'),
    };
  }, [reports, chartMode]);

  const handleOpenAddModal = () => {
    setEditingRegulation(null);
    setFormCode('');
    setFormDescription('');
    setFormFine('');
    setFormJailTime('');
    setFormCategory('satlantas');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reg: Regulation) => {
    setEditingRegulation(reg);
    setFormCode(reg.code);
    setFormDescription(reg.description);
    setFormFine(reg.fine.toString());
    setFormJailTime(reg.jailTime.toString());
    setFormCategory(reg.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formDescription || !formFine || !formJailTime) {
      setFormError('Harap lengkapi semua kolom form input!');
      return;
    }
    const fineNumber = parseFloat(formFine);
    const jailNumber = parseInt(formJailTime);
    if (isNaN(fineNumber) || fineNumber < 0) {
      setFormError('Nominal denda harus berupa angka positif!');
      return;
    }
    if (isNaN(jailNumber) || jailNumber < 0) {
      setFormError('Hukuman kurungan harus berupa angka positif!');
      return;
    }
    const regData: Regulation = {
      id: editingRegulation ? editingRegulation.id : `reg-${Date.now()}`,
      code: formCode.toUpperCase().trim(),
      description: formDescription.trim(),
      fine: fineNumber,
      baseFine: fineNumber,
      jailTime: jailNumber,
      category: formCategory,
    };
    if (editingRegulation) {
      onEditRegulation(regData);
    } else {
      const codeExists = regulations.some((r) => r.code.toUpperCase() === regData.code);
      if (codeExists) {
        setFormError(`Kode pasal ${regData.code} sudah digunakan!`);
        return;
      }
      onAddRegulation(regData);
    }
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-3 relative">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total Pasal', value: stats.total.toString(), color: 'text-cyan-400' },
          { label: 'Total Laporan', value: reports.length.toString(), color: 'text-emerald-400' },
          { label: 'Kriminal', value: reports.filter((r) => r.type === 'kriminal').length.toString(), color: 'text-amber-400' },
          { label: 'Lalu Lintas', value: reports.filter((r) => r.type === 'lalu_lintas').length.toString(), color: 'text-red-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-2.5 sm:p-3 text-center hover-bounce"
          >
            <span className={`text-lg sm:text-xl font-mono font-bold block ${stat.color}`}>{stat.value}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-sans uppercase tracking-wider">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Trend & Denda Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-2.5 flex items-center gap-2">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
            crimeRate.kriminal.status === 'empty' ? 'bg-slate-500/10 text-slate-500' :
            crimeRate.kriminal.status === 'new' ? 'bg-cyan-500/10 text-cyan-400' :
            crimeRate.kriminal.direction === 'up' ? 'bg-red-500/10 text-red-400' :
            crimeRate.kriminal.direction === 'down' ? 'bg-emerald-500/10 text-emerald-400' :
            'bg-slate-500/10 text-slate-400'
          }`}>
            {crimeRate.kriminal.status === 'empty' ? '—' : crimeRate.kriminal.status === 'new' ? '•' : crimeRate.kriminal.direction === 'up' ? '↑' : crimeRate.kriminal.direction === 'down' ? '↓' : '—'}
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-mono font-bold block ${
              crimeRate.kriminal.status === 'empty' ? 'text-slate-500' :
              crimeRate.kriminal.status === 'new' ? 'text-cyan-400' :
              crimeRate.kriminal.direction === 'up' ? 'text-red-400' :
              crimeRate.kriminal.direction === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {crimeRate.kriminal.status === 'empty' ? 'Baru' :
               crimeRate.kriminal.status === 'new' ? `${crimeRate.kriminal.current} Baru` :
               crimeRate.kriminal.direction === 'up' ? `+${crimeRate.kriminal.percent}%` :
               crimeRate.kriminal.direction === 'down' ? `-${crimeRate.kriminal.percent}%` : 'Stabil'}
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-sans">Tren Kriminal</span>
          </div>
        </div>
        <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-2.5 flex items-center gap-2">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
            crimeRate.laluLintas.status === 'empty' ? 'bg-slate-500/10 text-slate-500' :
            crimeRate.laluLintas.status === 'new' ? 'bg-cyan-500/10 text-cyan-400' :
            crimeRate.laluLintas.direction === 'up' ? 'bg-red-500/10 text-red-400' :
            crimeRate.laluLintas.direction === 'down' ? 'bg-emerald-500/10 text-emerald-400' :
            'bg-slate-500/10 text-slate-400'
          }`}>
            {crimeRate.laluLintas.status === 'empty' ? '—' : crimeRate.laluLintas.status === 'new' ? '•' : crimeRate.laluLintas.direction === 'up' ? '↑' : crimeRate.laluLintas.direction === 'down' ? '↓' : '—'}
          </div>
          <div>
            <span className={`text-xs sm:text-sm font-mono font-bold block ${
              crimeRate.laluLintas.status === 'empty' ? 'text-slate-500' :
              crimeRate.laluLintas.status === 'new' ? 'text-cyan-400' :
              crimeRate.laluLintas.direction === 'up' ? 'text-red-400' :
              crimeRate.laluLintas.direction === 'down' ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {crimeRate.laluLintas.status === 'empty' ? 'Baru' :
               crimeRate.laluLintas.status === 'new' ? `${crimeRate.laluLintas.current} Baru` :
               crimeRate.laluLintas.direction === 'up' ? `+${crimeRate.laluLintas.percent}%` :
               crimeRate.laluLintas.direction === 'down' ? `-${crimeRate.laluLintas.percent}%` : 'Stabil'}
            </span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-sans">Tren Lalu Lintas</span>
          </div>
        </div>
        <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-2.5 flex items-center gap-2 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-emerald-500/10">
            <span className="text-emerald-400 text-sm">Rp</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400 block">{formatCurrency(totalDenda)}</span>
            <span className="text-[8px] sm:text-[9px] text-slate-500 font-sans">Denda {chartMode === 'day' ? 'Hari Ini' : chartMode === 'week' ? 'Minggu Ini' : 'Bulan Ini'}</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Donut Chart */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-cyan-950/60 rounded-lg p-3 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 shimmer pointer-events-none" />
          <h2 className="text-slate-200 font-display font-bold text-[10px] sm:text-xs tracking-widest text-center flex items-center justify-center gap-1.5 mb-3 relative">
            <PieChart className="w-3.5 h-3.5 text-cyan-400" />
            PASAL PER KATEGORI
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-3 flex-1 relative">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(15,23,42,0.8)" strokeWidth="4.5" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#22d3ee" strokeWidth="4.5" strokeDasharray={`${stats.satlantas} ${100 - stats.satlantas}`} strokeDashoffset="0" className="transition-all duration-1000" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray={`${stats.ringan} ${100 - stats.ringan}`} strokeDashoffset={-stats.satlantas} className="transition-all duration-1000" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray={`${stats.menengah} ${100 - stats.menengah}`} strokeDashoffset={-(stats.satlantas + stats.ringan)} className="transition-all duration-1000" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4.5" strokeDasharray={`${stats.berat} ${100 - stats.berat}`} strokeDashoffset={-(stats.satlantas + stats.ringan + stats.menengah)} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm sm:text-base font-mono font-bold text-slate-100">{stats.total}</span>
                <span className="text-[7px] sm:text-[8px] text-slate-500 font-sans tracking-widest uppercase">Pasal</span>
              </div>
            </div>
            <div className="space-y-1 text-[9px] sm:text-[10px] font-sans w-full sm:w-auto shrink-0">
              {[
                { label: 'Satlantas', pct: stats.satlantas, color: 'bg-cyan-400', textColor: 'text-cyan-400' },
                { label: 'Ringan', pct: stats.ringan, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'Menengah', pct: stats.menengah, color: 'bg-amber-500', textColor: 'text-amber-500' },
                { label: 'Berat', pct: stats.berat, color: 'bg-red-500', textColor: 'text-red-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-slate-400 min-w-[55px] sm:min-w-[70px]">{item.label}:</span>
                  <span className={`${item.textColor} font-mono font-bold`}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart - Real Data */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-cyan-950/60 rounded-lg p-3 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-200 font-display font-bold text-[10px] sm:text-xs tracking-widest flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              LAPORAN
            </h2>
            <div className="flex gap-0.5 bg-slate-900/60 border border-cyan-950/40 rounded p-0.5">
              {[
                { id: 'day' as const, label: 'Hari' },
                { id: 'week' as const, label: 'Minggu' },
                { id: 'month' as const, label: 'Bulan' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setChartMode(mode.id)}
                  className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    chartMode === mode.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className={`grid gap-1 sm:gap-2 items-end h-16 sm:h-20 px-1 sm:px-2 relative ${
              chartMode === 'day' ? 'grid-cols-7' : chartMode === 'week' ? 'grid-cols-4' : 'grid-cols-6'
            }`}>
              <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="w-full border-t border-cyan-500" />
                <div className="w-full border-t border-cyan-500" />
                <div className="w-full border-t border-cyan-500" />
                <div className="w-full border-t border-cyan-500" />
              </div>
              {reportStats.map((d, idx) => {
                const heightPercentage = maxReportCount > 0 ? (d.count / maxReportCount) * 100 : 0;
                return (
                  <div key={idx} className="flex flex-col items-center group relative z-10">
                    <div className="absolute -top-8 sm:-top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-cyan-400 border border-cyan-500/30 text-[9px] sm:text-[10px] font-mono px-2 py-1 rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                      {d.count} Laporan · {formatCurrency(d.fine)}
                    </div>
                    <div
                      style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                      className="w-4 sm:w-5 bg-gradient-to-t from-cyan-950 via-cyan-500 to-cyan-300 rounded-t-md cursor-pointer transition-all duration-500 hover:brightness-125 border-t border-cyan-300/40 shadow-[0_0_8px_rgba(34,211,238,0.15)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    />
                  </div>
                );
              })}
            </div>
            <div className={`grid gap-1 sm:gap-2 text-center mt-1.5 text-[8px] sm:text-[9px] font-mono text-slate-500 ${
              chartMode === 'day' ? 'grid-cols-7' : chartMode === 'week' ? 'grid-cols-4' : 'grid-cols-6'
            }`}>
              {reportStats.map((d, idx) => (
                <span key={idx}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inflation Adjustment */}
      <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h3 className="text-slate-300 font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase">
            PENYESUAIAN HARGA INFLASI
          </h3>
          {inflationPercent > 0 && (
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              +{inflationPercent}% diterapkan
            </span>
          )}
        </div>
        <p className="text-slate-500 text-[9px] sm:text-[10px] font-sans mb-2">
          Masukkan persentase kenaikan inflasi untuk menyesuaikan semua harga denda secara otomatis.
        </p>
        <div className="flex items-end gap-2">
          <div className="flex-1 max-w-[140px]">
            <label className="block text-slate-500 text-[9px] font-mono uppercase tracking-wider mb-1">
              Persentase Inflasi
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="10000"
                placeholder="Contoh: 100"
                value={inflationInput}
                onChange={(e) => setInflationInput(e.target.value)}
                className="w-full bg-slate-900 border border-cyan-950 rounded-lg py-1.5 pl-2 pr-7 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-all"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500/50 text-[10px] font-mono">%</span>
            </div>
          </div>
          <button
            onClick={() => {
              const val = parseInt(inflationInput);
              if (val > 0 && val <= 10000) {
                onApplyInflation(val);
                setInflationInput('');
              }
            }}
            disabled={!inflationInput || parseInt(inflationInput) <= 0}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed hover-bounce"
          >
            Terapkan
          </button>
        </div>
        <div className="mt-2 flex gap-1.5 flex-wrap">
          {[10, 50, 100, 200, 300].map((pct) => (
            <button
              key={pct}
              onClick={() => onApplyInflation(pct)}
              className="px-2 py-1 bg-slate-900/60 hover:bg-cyan-950/40 border border-cyan-950/40 hover:border-cyan-500/30 rounded text-[9px] font-mono text-slate-400 hover:text-cyan-400 cursor-pointer transition-all"
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-start">
        <button
          onClick={handleOpenAddModal}
          className="bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 hover:border-cyan-400/90 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] px-3 py-1.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest cursor-pointer transition-all duration-300 flex items-center gap-1.5 hover-bounce"
        >
          <Plus className="w-3 h-3" />
          TAMBAH REGULASI BARU
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-950/60 border border-cyan-950/60 rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-slate-900/40 border-b border-cyan-950/80 flex justify-between items-center">
          <h3 className="text-slate-300 font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            DAFTAR MASTER DATA REGULASI
          </h3>
          <span className="text-[8px] sm:text-[9px] font-mono text-slate-500">
            Total: {regulations.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[10px] sm:text-xs">
            <thead>
              <tr className="border-b border-cyan-950/80 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider text-cyan-400 uppercase bg-slate-900/20">
                <th className="px-2 sm:px-3 py-1.5">Kode</th>
                <th className="px-2 sm:px-3 py-1.5 hidden sm:table-cell">Deskripsi</th>
                <th className="px-2 sm:px-3 py-1.5 sm:hidden">Desk.</th>
                <th className="px-2 sm:px-3 py-1.5">Denda</th>
                <th className="px-2 sm:px-3 py-1.5 hidden md:table-cell">Kurungan</th>
                <th className="px-2 sm:px-3 py-1.5">Kategori</th>
                <th className="px-2 sm:px-3 py-1.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/30 text-slate-300 font-sans">
              {regulations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-500 italic">
                    Belum ada data regulasi tersedia.
                  </td>
                </tr>
              ) : (
                regulations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-2 sm:px-3 py-1.5 font-mono font-bold text-cyan-400">{reg.code}</td>
                    <td className="px-2 sm:px-3 py-1.5 font-medium max-w-[120px] sm:max-w-xs md:max-w-md truncate" title={reg.description}>
                      {reg.description}
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 font-mono font-semibold text-slate-100">
                      {formatCurrency(reg.fine)}
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 font-mono text-slate-400 hidden md:table-cell">
                      {reg.jailTime === 0 ? '0 Bln' : `${reg.jailTime} Bln`}
                    </td>
                    <td className="px-2 sm:px-3 py-1.5">
                      <span className={`text-[8px] sm:text-[9px] font-mono font-bold px-1 sm:px-1.5 py-px rounded border ${
                        reg.category === 'satlantas' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                        : reg.category === 'ringan' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : reg.category === 'menengah' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {reg.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenEditModal(reg)} className="p-1 hover:bg-cyan-500/10 text-cyan-400 rounded transition-colors cursor-pointer" title="Edit">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => onDeleteRegulation(reg.id)} className="p-1 hover:bg-red-500/10 text-red-400 rounded transition-colors cursor-pointer" title="Hapus">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm sm:max-w-md bg-slate-950/90 border border-cyan-500/40 rounded-xl p-4 sm:p-5 shadow-[0_0_30px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col z-10"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-cyan-400 font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {editingRegulation ? 'EDIT DATA REGULASI' : 'FORM INPUT DATA REGULASI'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-0.5 text-slate-500 hover:text-slate-200 rounded-full hover:bg-slate-900 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-2.5 font-sans">
                {formError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] sm:text-xs font-sans leading-relaxed">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-slate-400 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider uppercase mb-1">Kode Pasal</label>
                  <input type="text" placeholder="Contoh: SL-11, PB-11" value={formCode} onChange={(e) => setFormCode(e.target.value)} disabled={!!editingRegulation} className="w-full bg-slate-900 border border-cyan-950 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider uppercase mb-1">Deskripsi Singkat</label>
                  <textarea rows={2} placeholder="Tuliskan pelanggaran..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full bg-slate-900 border border-cyan-950 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder-slate-600" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider uppercase mb-1">Denda ($)</label>
                    <input type="number" placeholder="Nominal $" value={formFine} onChange={(e) => setFormFine(e.target.value)} className="w-full bg-slate-900 border border-cyan-950 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder-slate-600 font-mono" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider uppercase mb-1">Kurungan (Bln)</label>
                    <input type="number" placeholder="Bulan" value={formJailTime} onChange={(e) => setFormJailTime(e.target.value)} className="w-full bg-slate-900 border border-cyan-950 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder-slate-600 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-[9px] sm:text-[10px] font-display font-semibold tracking-wider uppercase mb-1">Kategori</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as RegulationCategory)} className="w-full bg-slate-900 border border-cyan-950 rounded p-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30">
                    <option value="satlantas">Satlantas (Lalu Lintas)</option>
                    <option value="ringan">Pasal Ringan</option>
                    <option value="menengah">Pasal Menengah</option>
                    <option value="berat">Pasal Berat</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold text-[10px] uppercase tracking-widest py-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5 hover-bounce">
                    <Save className="w-3 h-3" />
                    SIMPAN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
