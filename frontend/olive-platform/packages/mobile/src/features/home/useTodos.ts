import { useCallback, useState } from "react";

import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { GetPressingOperations } from "@olive-platform/core/features/production/domain/useCases/GetPressingOperations";
import { GetHarvests } from "@olive-platform/core/features/harvests/domain/usecases/GetHarvests";
import { OliveAnalysesRepository } from "@olive-platform/core/features/analyses/oliveAnalyses/data/repositories/OliveAnalysesRepository";
import { OilAnalysesRepository } from "@olive-platform/core/features/analyses/oilAnalyses/data/repositories/OilAnalysesRepository";
import { GetOliveLots } from "@olive-platform/core/features/oliveLots/domain/usecases/GetOliveLots";
import { GetBufferTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetBufferTanks";
import { bufferOilState } from "@olive-platform/core/features/tanks/domain/OilType";

// Tâches en attente de la campagne, par domaine.
export type TodoSummary = {
  harvests: { toStart: number; toClose: number };
  pressings: { toStart: number; toClose: number };
  analyses: { olive: number; oil: number; oilToTransfer: number };
  // Olives analysées pas encore pressées.
  readyOlives: { kg: number; lots: number };
};

const EMPTY: TodoSummary = {
  harvests: { toStart: 0, toClose: 0 },
  pressings: { toStart: 0, toClose: 0 },
  analyses: { olive: 0, oil: 0, oilToTransfer: 0 },
  readyOlives: { kg: 0, lots: 0 },
};

const PAGE = { pageNumber: 1, pageSize: 100 };

const OPEN_STATUSES: ProductionStatus[] = [ProductionStatus.Planned, ProductionStatus.InProgress];

// Résultat d'un appel, ou liste vide s'il échoue (la page reste utilisable).
const listOf = <T,>(result: PromiseSettledResult<T[]>) =>
  result.status === "fulfilled" ? result.value : [];

const itemsOf = <T,>(result: PromiseSettledResult<{ items: T[] }>) =>
  result.status === "fulfilled" ? result.value.items : [];

const countStatus = (items: { status: ProductionStatus }[], status: ProductionStatus) =>
  items.filter((item) => item.status === status).length;

/**
 * Ce que l'opérateur a à faire sur la campagne : récoltes et pressions à
 * lancer ou clôturer, analyses en attente, huile à transférer, olives prêtes.
 */
export function useTodos() {
  const [summary, setSummary] = useState<TodoSummary>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled([
      GetHarvests(PAGE),
      GetPressingOperations(PAGE),
      OliveAnalysesRepository.getAll(PAGE),
      OilAnalysesRepository.getAll(PAGE),
      GetBufferTanks(),
      GetOliveLots({ available: true }),
    ]);

    const harvests = itemsOf(results[0]);
    const pressings = itemsOf(results[1]);
    const oliveAnalyses = itemsOf(results[2]);
    const oilAnalyses = itemsOf(results[3]);
    const bufferTanks = listOf(results[4]);
    const readyLots = listOf(results[5]).filter((lot) => lot.isPressable);

    setSummary({
      harvests: {
        toStart: countStatus(harvests, ProductionStatus.Planned),
        toClose: countStatus(harvests, ProductionStatus.InProgress),
      },
      pressings: {
        toStart: countStatus(pressings, ProductionStatus.Planned),
        toClose: countStatus(pressings, ProductionStatus.InProgress),
      },
      analyses: {
        olive: oliveAnalyses.filter((analysis) => OPEN_STATUSES.includes(analysis.status)).length,
        oil: oilAnalyses.filter((analysis) => OPEN_STATUSES.includes(analysis.status)).length,
        // Huile analysée encore en citerne tampon.
        oilToTransfer: bufferTanks.filter((tank) => bufferOilState(tank).kind === "analysed").length,
      },
      readyOlives: {
        kg: readyLots.reduce((total, lot) => total + Number(lot.remainingKg), 0),
        lots: readyLots.length,
      },
    });

    setFailed(results.every((result) => result.status === "rejected"));
    setLoading(false);
  }, []);

  return { summary, loading, failed, load };
}
