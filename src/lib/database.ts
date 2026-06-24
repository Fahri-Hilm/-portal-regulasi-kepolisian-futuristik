import { supabase, isSupabaseConfigured } from './supabase';
export { isSupabaseConfigured } from './supabase';
import { Regulation, IncidentReport } from '../types';
import { INITIAL_REGULATIONS, INITIAL_REPORTS } from '../data';

// ============================================
// LOCAL STORAGE HELPERS (Offline Fallback)
// ============================================
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

// ============================================
// REGULATIONS
// ============================================
export async function fetchRegulations(): Promise<Regulation[]> {
  if (!isSupabaseConfigured) return loadLocal('pkr_regulations', INITIAL_REGULATIONS);

  const { data, error } = await supabase!
    .from('regulations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[PORTAL] Fetch regulations error:', error);
    return loadLocal('pkr_regulations', INITIAL_REGULATIONS);
  }

  const regulations: Regulation[] = (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    code: r.code as string,
    description: r.description as string,
    fine: r.fine as number,
    baseFine: (r.base_fine as number) || (r.fine as number),
    jailTime: r.jail_time as number,
    category: r.category as Regulation['category'],
  }));

  saveLocal('pkr_regulations', regulations);
  return regulations;
}

export async function insertRegulation(reg: Regulation): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const existing = loadLocal<Regulation[]>('pkr_regulations', INITIAL_REGULATIONS);
    saveLocal('pkr_regulations', [reg, ...existing]);
    return true;
  }

  const { error } = await supabase!.from('regulations').insert({
    id: reg.id,
    code: reg.code,
    description: reg.description,
    fine: reg.fine,
    base_fine: reg.baseFine,
    jail_time: reg.jailTime,
    category: reg.category,
  });

  if (error) {
    console.error('[PORTAL] Insert regulation error:', error);
    return false;
  }
  return true;
}

export async function updateRegulation(reg: Regulation): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const existing = loadLocal<Regulation[]>('pkr_regulations', INITIAL_REGULATIONS);
    saveLocal('pkr_regulations', existing.map((r) => (r.id === reg.id ? reg : r)));
    return true;
  }

  const { error } = await supabase!.from('regulations').update({
    code: reg.code,
    description: reg.description,
    fine: reg.fine,
    base_fine: reg.baseFine,
    jail_time: reg.jailTime,
    category: reg.category,
  }).eq('id', reg.id);

  if (error) {
    console.error('[PORTAL] Update regulation error:', error);
    return false;
  }
  return true;
}

export async function deleteRegulation(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const existing = loadLocal<Regulation[]>('pkr_regulations', INITIAL_REGULATIONS);
    saveLocal('pkr_regulations', existing.filter((r) => r.id !== id));
    return true;
  }

  const { error } = await supabase!.from('regulations').delete().eq('id', id);

  if (error) {
    console.error('[PORTAL] Delete regulation error:', error);
    return false;
  }
  return true;
}

export async function batchUpdateRegulations(regulations: Regulation[]): Promise<boolean> {
  if (!isSupabaseConfigured) {
    saveLocal('pkr_regulations', regulations);
    return true;
  }

  const updates = regulations.map((reg) =>
    supabase!.from('regulations').update({
      fine: reg.fine,
      base_fine: reg.baseFine,
      jail_time: reg.jailTime,
    }).eq('id', reg.id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    console.error('[PORTAL] Batch update regulations error');
    return false;
  }
  return true;
}

// ============================================
// REPORTS
// ============================================
export async function fetchReports(): Promise<IncidentReport[]> {
  if (!isSupabaseConfigured) return loadLocal('pkr_reports', INITIAL_REPORTS);

  const { data, error } = await supabase!
    .from('reports')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('[PORTAL] Fetch reports error:', error);
    return loadLocal('pkr_reports', INITIAL_REPORTS);
  }

  const reports: IncidentReport[] = (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    timestamp: r.timestamp as string,
    citizenName: r.citizen_name as string,
    articles: r.articles as string[],
    totalFine: r.total_fine as number,
    totalJailTime: r.total_jail_time as number,
    type: r.type as IncidentReport['type'],
  }));

  saveLocal('pkr_reports', reports);
  return reports;
}

export async function insertReport(report: IncidentReport): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const existing = loadLocal<IncidentReport[]>('pkr_reports', INITIAL_REPORTS);
    saveLocal('pkr_reports', [report, ...existing]);
    return true;
  }

  const { error } = await supabase!.from('reports').insert({
    id: report.id,
    timestamp: report.timestamp,
    citizen_name: report.citizenName,
    articles: report.articles,
    total_fine: report.totalFine,
    total_jail_time: report.totalJailTime,
    type: report.type,
  });

  if (error) {
    console.error('[PORTAL] Insert report error:', error);
    return false;
  }
  return true;
}

export async function deleteReport(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const existing = loadLocal<IncidentReport[]>('pkr_reports', INITIAL_REPORTS);
    saveLocal('pkr_reports', existing.filter((r) => r.id !== id));
    return true;
  }

  const { error } = await supabase!.from('reports').delete().eq('id', id);

  if (error) {
    console.error('[PORTAL] Delete report error:', error);
    return false;
  }
  return true;
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================
type ChangeCallback = () => void;

export function subscribeToChanges(onChange: ChangeCallback) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase!
    .channel('portal-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'regulations' }, () => {
      onChange();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
      onChange();
    })
    .subscribe();

  return () => {
    supabase!.removeChannel(channel);
  };
}
