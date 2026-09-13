

// All values below are fake placeholders for layout/design purposes only.

import type { AlertItem, HarvestPoint, KpiDatum, OilAnalysis, PressingBatch, Purchase, StockTank } from "../domain/dashboard.types";

export const kpis: KpiDatum[] = [
  { label: 'Récolte campagne', value: '184.2', unit: 't', deltaPct: 12, deltaLabel: 'vs campagne N-1', accent: 'harvest' },
  { label: 'Achats en attente', value: '9', unit: 'lots', deltaPct: -4, deltaLabel: 'vs semaine dernière', accent: 'purchase' },
  { label: 'Rendement moyen trituration', value: '18.4', unit: '%', deltaPct: 2.1, deltaLabel: 'vs objectif 17%', accent: 'pressing' },
  { label: "Lots conformes labo", value: '92', unit: '%', deltaPct: -3, deltaLabel: 'vs mois dernier', accent: 'quality' },
];

export const harvestTrend: HarvestPoint[] = [
  { week: 'S1', quantityKg: 8200, parcels: 4 },
  { week: 'S2', quantityKg: 11400, parcels: 6 },
  { week: 'S3', quantityKg: 15800, parcels: 7 },
  { week: 'S4', quantityKg: 21300, parcels: 9 },
  { week: 'S5', quantityKg: 26900, parcels: 11 },
  { week: 'S6', quantityKg: 31500, parcels: 12 },
  { week: 'S7', quantityKg: 28700, parcels: 10 },
  { week: 'S8', quantityKg: 24100, parcels: 8 },
  { week: 'S9', quantityKg: 16400, parcels: 5 },
];

export const recentPurchases: Purchase[] = [
  { id: 'AC-1042', date: '2026-09-11', supplier: 'Ben Salah Fermes', region: 'Sfax', varietal: 'Chemlali', quantityKg: 3200, pricePerKgTnd: 1.85, status: 'received' },
  { id: 'AC-1041', date: '2026-09-11', supplier: 'Coopérative El Amel', region: 'Sousse', varietal: 'Chetoui', quantityKg: 1850, pricePerKgTnd: 2.05, status: 'pending' },
  { id: 'AC-1040', date: '2026-09-10', supplier: 'Trabelsi & Fils', region: 'Sfax', varietal: 'Chemlali', quantityKg: 4100, pricePerKgTnd: 1.80, status: 'received' },
  { id: 'AC-1039', date: '2026-09-10', supplier: 'Ferme Zitouna', region: 'Kairouan', varietal: 'Chemlali', quantityKg: 2600, pricePerKgTnd: 1.90, status: 'rejected' },
  { id: 'AC-1038', date: '2026-09-09', supplier: 'Coopérative El Amel', region: 'Sousse', varietal: 'Chetoui', quantityKg: 2950, pricePerKgTnd: 2.00, status: 'received' },
];

export const pressingBatches: PressingBatch[] = [
  { id: 'TR-318', date: '2026-09-11', oliveInputKg: 3200, oilOutputL: 610, yieldPct: 19.1 },
  { id: 'TR-317', date: '2026-09-11', oliveInputKg: 4100, oilOutputL: 738, yieldPct: 18.0 },
  { id: 'TR-316', date: '2026-09-10', oliveInputKg: 2600, oilOutputL: 442, yieldPct: 17.0 },
  { id: 'TR-315', date: '2026-09-10', oliveInputKg: 2950, oilOutputL: 560, yieldPct: 19.0 },
];

export const oilAnalyses: OilAnalysis[] = [
  { batchId: 'TR-318', date: '2026-09-12', acidityPct: 0.32, peroxideIndex: 8.4, grade: 'Extra Vierge', status: 'pass' },
  { batchId: 'TR-317', date: '2026-09-12', acidityPct: 0.58, peroxideIndex: 11.2, grade: 'Extra Vierge', status: 'warning' },
  { batchId: 'TR-316', date: '2026-09-11', acidityPct: 0.95, peroxideIndex: 14.6, grade: 'Vierge', status: 'warning' },
  { batchId: 'TR-315', date: '2026-09-11', acidityPct: 0.28, peroxideIndex: 7.1, grade: 'Extra Vierge', status: 'pass' },
];

export const stockTanks: StockTank[] = [
  { id: 'CUVE-01', label: 'Cuve 01', capacityL: 5000, currentL: 4200, grade: 'Extra Vierge' },
  { id: 'CUVE-02', label: 'Cuve 02', capacityL: 5000, currentL: 1850, grade: 'Extra Vierge' },
  { id: 'CUVE-03', label: 'Cuve 03', capacityL: 3000, currentL: 2760, grade: 'Vierge' },
  { id: 'CUVE-04', label: 'Cuve 04', capacityL: 3000, currentL: 640, grade: 'Lampante' },
];

export const alerts: AlertItem[] = [
  { id: 'AL-1', severity: 'critical', message: "Lot TR-316 : indice de peroxyde proche du seuil réglementaire", time: 'il y a 2 h' },
  { id: 'AL-2', severity: 'warning', message: "Cuve 04 sous 25% de sa capacité — planifier transfert", time: 'il y a 5 h' },
  { id: 'AL-3', severity: 'warning', message: "Lot AC-1039 refusé — taux de mouche olive hors norme", time: 'hier' },
  { id: 'AL-4', severity: 'info', message: "Analyse labo programmée pour TR-318 à 14h00", time: 'hier' },
];
