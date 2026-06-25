import React, { useState, useMemo } from 'react';
import { IncidentReport, Regulation, ReportType } from '../types';
import { Clock, FileText, Trash2, Printer, CheckCircle, AlertTriangle, Car, ShieldAlert, Share2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportViewProps {
  reports: IncidentReport[];
  regulations: Regulation[];
  onDeleteReport: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info' | 'system') => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  reports,
  regulations,
  onDeleteReport,
  addToast,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<ReportType>('kriminal');
  const [invoiceReport, setInvoiceReport] = useState<IncidentReport | null>(null);

  const filteredReports = useMemo(
    () => reports.filter((r) => r.type === activeReportTab),
    [reports, activeReportTab]
  );

  const trafficRepeatOffenders = useMemo(() => {
    const trafficReports = reports.filter((r) => r.type === 'lalu_lintas');
    const nameCounts: Record<string, number> = {};
    trafficReports.forEach((r) => {
      const name = r.citizenName.toLowerCase();
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    });
    return nameCounts;
  }, [reports]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

  const formatDate = (isoStr: string) =>
    new Date(isoStr).toLocaleString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const handleCopyASCII = async (rep: IncidentReport) => {
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);

    const articleCodes = rep.articles.map((aid) => {
      const reg = regulations.find((r) => r.id === aid);
      return reg ? `• [${reg.code}] ${reg.description}` : `• ${aid}`;
    }).join('\n');

    const isTraffic = rep.type === 'lalu_lintas';
    const headerTitle = isTraffic 
      ? '        🚔  LAPORAN TILANG KOTA  🚔        ' 
      : '       🚔  LAPORAN KRIMINAL KOTA  🚔       ';
    const labelSuspect = isTraffic ? 'Pelanggar' : 'Tersangka';

    const shareText = 
      `\`\`\`text\n` +
      `===========================================\n` +
      `${headerTitle}\n` +
      `===========================================\n` +
      `ID: ${rep.id.toUpperCase()}\n` +
      `Waktu: ${formatDate(rep.timestamp)}\n` +
      `-------------------------------------------\n` +
      `${labelSuspect}: ${rep.citizenName}\n` +
      `Kategori: ${rep.type === 'lalu_lintas' ? 'Lalu Lintas' : 'Kriminal'}\n` +
      `-------------------------------------------\n` +
      `Rincian Pasal:\n${articleCodes}\n` +
      `-------------------------------------------\n` +
      `Total Denda: ${formatCurrency(rep.totalFine)}\n` +
      `Kurungan: ${rep.totalJailTime} Bulan\n` +
      `-------------------------------------------\n` +
      `     DEPARTEMEN KEPOLISIAN FUTURISTIK      \n` +
      `===========================================\n` +
      `\`\`\``;

    try {
      await navigator.clipboard.writeText(shareText);
      addToast('[📋] LAPORAN FORMAT ASCII DISALIN KE CLIPBOARD', 'success');
    } catch (err) {
      console.error('Failed to copy ASCII:', err);
      alert('Gagal menyalin ke clipboard.');
    }
  };

  const handleShareInvoice = async (rep: IncidentReport) => {
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(20);

    const articleCodes = rep.articles.map((aid) => {
      const reg = regulations.find((r) => r.id === aid);
      return reg ? `[${reg.code}] ${reg.description}` : aid;
    }).join('\n');

    const shareText = `🚔 *SURAT TILANG KOTA* 🚔\n` +
      `ID: ${rep.id.toUpperCase()}\n` +
      `Tanggal: ${formatDate(rep.timestamp)}\n` +
      `---------------------------------\n` +
      `*Pelanggar/Tersangka:* ${rep.citizenName}\n` +
      `*Tipe:* ${rep.type === 'lalu_lintas' ? 'Lalu Lintas' : 'Kriminal'}\n` +
      `---------------------------------\n` +
      `*Rincian Pasal:*\n${articleCodes}\n` +
      `---------------------------------\n` +
      `*Total Denda:* ${formatCurrency(rep.totalFine)}\n` +
      `*Kurungan:* ${rep.totalJailTime} Bulan\n\n` +
      `_Harap segera melakukan pembayaran atau datang ke Markas Kepolisian terdekat._`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surat Tilang - ${rep.citizenName}`,
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        addToast('[📋] LAPORAN TILANG DISALIN KE CLIPBOARD', 'success');
      } catch (err) {
        console.error('Clipboard fallback failed:', err);
      }
    }
  };

  const renderReportCard = (rep: IncidentReport) => {
    const isRepeatTraffic = rep.type === 'lalu_lintas' && (trafficRepeatOffenders[rep.citizenName.toLowerCase()] || 0) > 1;

    return (
      <div
        key={rep.id}
        className="bg-slate-900/40 border border-cyan-950/50 rounded-lg p-2.5 relative hover:border-cyan-500/20 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-2"
      >
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-cyan-400 font-mono font-bold text-[9px] tracking-wider">{rep.id.toUpperCase()}</span>
            <span className="text-slate-600 text-[9px] font-mono">•</span>
            <span className="text-slate-500 text-[9px] font-sans">{formatDate(rep.timestamp)}</span>
            {isRepeatTraffic && (
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" />
                PELANGGARAN ULANG
              </span>
            )}
          </div>

          <div>
            <h4 className="text-slate-100 font-display font-bold text-xs tracking-wide">
              {rep.type === 'lalu_lintas' ? 'Warga:' : 'Tersangka:'} {rep.citizenName}
            </h4>
          </div>

          {isRepeatTraffic && (
            <div className="text-[9px] text-amber-400/80 font-sans flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
              Warga ini telah melanggar lalu lintas sebanyak {trafficRepeatOffenders[rep.citizenName.toLowerCase()]} kali!
            </div>
          )}

          <div className="flex flex-wrap gap-1 pt-0.5">
            {rep.articles.map((aid) => {
              const reg = regulations.find((r) => r.id === aid);
              if (!reg) return null;
              return (
                <span key={aid} className="text-[8px] font-mono px-1.5 py-px rounded bg-slate-950 border border-cyan-950/60 text-slate-400">
                  {reg.code}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex md:flex-col items-end justify-between md:justify-center gap-1.5 border-t md:border-t-0 border-cyan-950/30 pt-2 md:pt-0">
          <div className="text-right font-mono text-[10px]">
            <span className="text-cyan-400 font-bold block">{formatCurrency(rep.totalFine)}</span>
            <span className="text-slate-500 block">{rep.totalJailTime} Bln</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleCopyASCII(rep)}
              className="p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded transition-colors cursor-pointer"
              title="Salin Laporan ASCII (Discord)"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => setInvoiceReport(rep)}
              className="p-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 rounded transition-colors cursor-pointer"
              title="Lihat Invoice"
            >
              <FileText className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDeleteReport(rep.id)}
              className="p-1 hover:bg-red-500/15 text-red-400 rounded transition-colors cursor-pointer"
              title="Hapus Laporan"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Tab Switcher */}
      <div className="flex gap-1.5 mb-3 shrink-0">
        <button
          onClick={() => setActiveReportTab('kriminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
            activeReportTab === 'kriminal'
              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'bg-slate-900/40 border-cyan-950 text-slate-500 hover:border-cyan-900 hover:text-slate-400'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          Kriminal
          <span className="text-[8px] font-mono bg-slate-950/40 px-1.5 py-0.5 rounded border border-cyan-950/40">
            {reports.filter((r) => r.type === 'kriminal').length}
          </span>
        </button>
        <button
          onClick={() => setActiveReportTab('lalu_lintas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
            activeReportTab === 'lalu_lintas'
              ? 'bg-amber-950/30 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
              : 'bg-slate-900/40 border-cyan-950 text-slate-500 hover:border-amber-900 hover:text-slate-400'
          }`}
        >
          <Car className="w-3 h-3" />
          Lalu Lintas
          <span className="text-[8px] font-mono bg-slate-950/40 px-1.5 py-0.5 rounded border border-cyan-950/40">
            {reports.filter((r) => r.type === 'lalu_lintas').length}
          </span>
        </button>
      </div>

      {/* Header */}
      <h2 className="text-slate-200 font-display font-bold text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5 shrink-0">
        {activeReportTab === 'kriminal' ? (
          <>
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            RIWAYAT LAPORAN KRIMINAL
          </>
        ) : (
          <>
            <Car className="w-3.5 h-3.5 text-amber-400" />
            RIWAYAT PELANGGARAN LALU LINTAS
          </>
        )}
        <span className="text-[9px] font-mono text-cyan-400/70 bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/10 ml-auto">
          {filteredReports.length} Laporan
        </span>
      </h2>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 compact-scrollbar">
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-sans">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30 text-cyan-400" />
            <p className="text-xs">
              {activeReportTab === 'kriminal'
                ? 'Belum ada riwayat laporan kriminal.'
                : 'Belum ada riwayat pelanggaran lalu lintas.'}
            </p>
            <p className="text-[10px] text-slate-600 mt-1">Pilih pasal di menu Regulasi, lalu klik "Konfirmasi Hitung".</p>
          </div>
        ) : (
          filteredReports.map(renderReportCard)
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInvoiceReport(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border-2 border-dashed border-cyan-500/40 rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10 font-mono text-slate-300 text-xs"
            >
              <div className="text-center space-y-1.5 pb-4 border-b border-dashed border-cyan-950/80">
                <h3 className="text-cyan-400 font-display font-black text-xs tracking-widest uppercase">
                  {invoiceReport.type === 'lalu_lintas' ? 'SURAT TILANG PELANGGARAN LALU LINTAS' : 'SURAT TILANG PELANGGARAN KRIMINAL'}
                </h3>
                <p className="text-slate-500 text-[9px]">DEPARTEMEN KEPOLISIAN FUTURISTIK ROLEPLAY</p>
                <p className="text-slate-600 text-[8px]">{invoiceReport.id.toUpperCase()} • {formatDate(invoiceReport.timestamp)}</p>
              </div>

              <div className="py-4 space-y-3">
                <div className="border-b border-cyan-950/30 pb-3">
                  <span className="text-slate-500 block uppercase text-[9px]">
                    {invoiceReport.type === 'lalu_lintas' ? 'WARGA / PELANGGAR:' : 'TERLAPOR/WARGA:'}
                  </span>
                  <strong className="text-slate-200 text-sm block mt-0.5">{invoiceReport.citizenName}</strong>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-500 block uppercase text-[9px]">RINCIAN PASAL:</span>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 compact-scrollbar">
                    {invoiceReport.articles.map((aid, idx) => {
                      const reg = regulations.find((r) => r.id === aid);
                      if (!reg) return null;
                      return (
                        <div key={idx} className="flex justify-between items-start gap-3">
                          <span className="text-slate-300">
                            <strong className="text-cyan-400 font-semibold pr-1">[{reg.code}]</strong>
                            {reg.description}
                          </span>
                          <span className="text-cyan-500 shrink-0 font-bold">{formatCurrency(reg.fine)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-dashed border-cyan-950/80 pt-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">TOTAL DENDA:</span>
                    <span className="text-cyan-400 neon-text-glow">{formatCurrency(invoiceReport.totalFine)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">TOTAL KURUNGAN:</span>
                    <span className="text-slate-200">{invoiceReport.totalJailTime} Bulan</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-dashed border-cyan-950/80 space-y-2">
                <p className="text-slate-500 text-[9px]">HARAP SEGERA MELAKUKAN PEMBAYARAN DI BANK KOTA ATAU DATANG KE MARKAS KEPOLISIAN TERDEKAT.</p>
                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-cyan-400 text-slate-950 font-bold rounded hover:bg-cyan-300 cursor-pointer transition-all uppercase text-[9px]"
                  >
                    <Printer className="w-3 h-3" />
                    CETAK
                  </button>
                  <button
                    onClick={() => handleCopyASCII(invoiceReport!)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 rounded cursor-pointer transition-all uppercase text-[9px]"
                  >
                    <Copy className="w-3 h-3" />
                    SALIN ASCII
                  </button>
                  <button
                    onClick={() => handleShareInvoice(invoiceReport!)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded cursor-pointer transition-all uppercase text-[9px]"
                  >
                    <Share2 className="w-3 h-3" />
                    BAGIKAN
                  </button>
                  <button
                    onClick={() => setInvoiceReport(null)}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-cyan-950 rounded cursor-pointer transition-all uppercase text-[9px]"
                  >
                    TUTUP
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
