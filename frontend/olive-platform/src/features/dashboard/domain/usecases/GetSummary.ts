import { DashboardRepository } from "../../data/repositories/DashboardRepository";
import type { DashboardSummary } from "../dashboard.types";

export const GetSummary = async () : Promise<DashboardSummary> =>
    await DashboardRepository.getSuammary();