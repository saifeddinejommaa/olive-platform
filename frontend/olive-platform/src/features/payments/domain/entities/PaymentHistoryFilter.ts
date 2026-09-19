export interface PaymentHistoryFilter {
  recipientName?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentDateFrom?: string;
  paymentDateTo?: string;
  pageNumber: number;
  pageSize: number;
}