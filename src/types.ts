export type RegulationCategory = 'satlantas' | 'ringan' | 'menengah' | 'berat';

export interface Regulation {
  id: string;
  code: string;
  description: string;
  fine: number;
  jailTime: number;
  category: RegulationCategory;
}

export type ReportType = 'kriminal' | 'lalu_lintas';

export interface IncidentReport {
  id: string;
  timestamp: string;
  citizenName: string;
  articles: string[];
  totalFine: number;
  totalJailTime: number;
  type: ReportType;
}
