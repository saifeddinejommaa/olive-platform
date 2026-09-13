// Shared types for the olive_platform dashboard widgets.

export interface HarvestPoint {
  week: string;        // e.g. "S1", "S2"...
  quantityKg: number;  // olives harvested that week
  parcels: number;     // number of parcels harvested that week
}

export interface Purchase {
  id: string;
  date: string;         // ISO date
  supplier: string;
  region: string;
  varietal: string;
  quantityKg: number;
  pricePerKgTnd: number;
  status: 'received' | 'pending' | 'rejected';
}

export interface PressingBatch {
  id: string;
  date: string;
  oliveInputKg: number;
  oilOutputL: number;
  yieldPct: number; // oilOutputL(kg-equiv) / oliveInputKg * 100
}

export interface OilAnalysis {
  batchId: string;
  date: string;
  acidityPct: number;      // free acidity, % oleic acid
  peroxideIndex: number;   // meq O2/kg
  grade: 'Extra Vierge' | 'Vierge' | 'Lampante';
  status: 'pass' | 'warning' | 'fail';
}

export interface StockTank {
  id: string;
  label: string;
  capacityL: number;
  currentL: number;
  grade: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  message: string;
  time: string; // relative or short time label
}

export type KpiAccent = 'harvest' | 'purchase' | 'pressing' | 'quality';

export interface KpiDatum {
  label: string;
  value: string;
  unit?: string;
  deltaPct: number;
  deltaLabel: string;
  accent: KpiAccent;
}
