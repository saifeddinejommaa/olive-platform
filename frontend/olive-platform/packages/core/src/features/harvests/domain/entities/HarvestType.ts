export const HarvestType = {
    Manuelle: 1,
    Peigne: 2,
    Moissonneuse: 3,
} as const;

export type HarvestType =
    (typeof HarvestType)[keyof typeof HarvestType];