export type CreatePressingOperationInputParams = {
  // Lot d'olives pressé (stock de récolte ou ligne d'achat).
  lotId: number;
  // Quantité prélevée ; absente = tout le restant du lot.
  quantityKg?: number | null;
};
