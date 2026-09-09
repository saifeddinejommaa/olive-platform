import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

export type HarvestForListResponse = {
    id: number;
    reference: string;

    plotId: number;

    plotName: string;

    harvestDate: string;

    startTime: string | null;

    endTime: string | null;

    quantityKg: number;

    qualityGrade: string | null;

    createdAt: string;

    harvestedTrees: number;

    plannedTrees: number;

    varietyId: number;

    status: number;

    notes: string | null;

    updatedAt: string;

    pressing: ProductionStatus | null;

    analysis: ProductionStatus | null;
    
    canBePressed: boolean;
};
