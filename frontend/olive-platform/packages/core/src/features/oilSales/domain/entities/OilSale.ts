import type { OilCategory } from "../../../tanks/domain/entities/Tank";

// Statuts d'une vente (table oil_sale_status).
export const OilSaleStatus = {
  // En préparation : le stock ne bouge pas.
  Draft: 1,
  // Validée : l'huile est sortie des citernes.
  Delivered: 2,
  Cancelled: 3,
} as const;

export type OilSaleStatus = (typeof OilSaleStatus)[keyof typeof OilSaleStatus];

export type PriceUnit = "kg" | "L";

export type OilSaleForList = {
  id: number;
  reference: string;
  saleDate: string;
  customerId: number;
  customerName: string;
  status: OilSaleStatus;
  statusLabel: string;
  // Citernes vendues (« code · catégorie »).
  tanks: string | null;
  quantityLiters: number;
  quantityKg: number | null;
  totalAmount: number;
  // Encaissé et reste à payer (TTC).
  paidAmount: number;
  remainingAmount: number;
};

export type OilSaleLine = {
  id: number;
  tankId: number;
  tankCode: string;
  tankName: string | null;
  oilCategory: OilCategory;
  oilCategoryLabel: string;
  quantityLiters: number;
  quantityKg: number | null;
  priceUnit: PriceUnit;
  unitPrice: number;
  amount: number;
  // Mouvements « Sortie vente » créés à la livraison.
  movementNumbers: string | null;
};

export type OilSaleDetails = OilSaleForList & {
  seasonId: number;
  customerReference: string;
  customerPhone: string | null;
  customerTaxId: string | null;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  deliveredAt: string | null;
  notes: string | null;
  createdAt: string;
  lines: OilSaleLine[];
  payments: OilSalePayment[];
};

// Encaissement d'une vente.
export type OilSalePayment = {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: number;
  paymentMethodLabel: string;
  // N° de chèque ou de virement.
  reference: string | null;
  notes: string | null;
};

// Paiement reçu à l'enlèvement, enregistré avec la livraison.
export type DeliveryPaymentParams = {
  amount: number;
  // 1 : espèce, 2 : chèque, 3 : virement.
  paymentMethod: number;
  reference?: string;
  paymentDate?: string;
};

export type OilSalesFilter = {
  // Référence ou client.
  search?: string;
  customerId?: number;
  status?: OilSaleStatus;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type CreateOilSaleLineParams = {
  tankId: number;
  quantityLiters: number;
  // Poids du ticket de pesée (obligatoire pour un prix au kg).
  quantityKg?: number;
  priceUnit: PriceUnit;
  unitPrice: number;
};

export type CreateOilSaleParams = {
  customerId: number;
  saleDate?: string;
  // TVA en %.
  taxRate: number;
  notes?: string;
  lines: CreateOilSaleLineParams[];
};
