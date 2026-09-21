import type { PaymentMethod } from "./PaymentMethod";

export interface ProcessedPayment {
  id: number;
  paymentDate: string;
  recipientName: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string | null;
  createdAt: string;
}