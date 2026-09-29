import { OilMovementRepository } from "../../data/repositories/OilMovementRepository";
import type {
  OilMovementsFilter,
  TransferOilBetweenTanksParams,
  TransferOilToStorageParams,
} from "../entities/OilMovement";

export const GetOilMovements = (filter?: OilMovementsFilter) =>
  OilMovementRepository.getMovements(filter);

export const TransferOilToStorage = (params: TransferOilToStorageParams) =>
  OilMovementRepository.transferToStorage(params);

export const TransferOilBetweenTanks = (params: TransferOilBetweenTanksParams) =>
  OilMovementRepository.transferBetweenTanks(params);
