export const PaymentMethod = {
    Cash: 1,
    Check: 2,
    BankTransfer: 3,

} as const;

export type PaymentMethod =
    (typeof PaymentMethod)[keyof typeof PaymentMethod];