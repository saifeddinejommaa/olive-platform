export const HarvestStockStatus = {
    Available: 1,
    PartiallyUsed: 2,
    Processing: 3,
    Empty: 4,
    Closed: 5
} as const;

export type HarvestStockStatus =
    (typeof HarvestStockStatus)[keyof typeof HarvestStockStatus];