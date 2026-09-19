export const CostLineType = {
 MainOeuvre : 1,
  Transport : 2,
  Location : 3,
  EntretienEtReparation : 4,
  MaterielEtConsommables : 5,
  Autre : 6,
  OlivePurchase : 7,
} as const;

export type CostLineType =
  (typeof CostLineType)[keyof typeof CostLineType];