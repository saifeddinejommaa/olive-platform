export type ClosePressingOperationRequest = {
  id: number;
  oilQuantity: number;
  // Citerne tampon qui reçoit l'huile en attendant son analyse.
  bufferTankId?: number;
};
