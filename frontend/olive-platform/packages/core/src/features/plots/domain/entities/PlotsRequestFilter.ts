import type { PaginationFilter } from "../../../../core/PaginationFilter";
import type { OliveVarieties } from "../../../shared/entities/OliveVarieties";

export type  PlotsRequestFilter = PaginationFilter &  {
reference?: string,
name?: string,
oliveVariety?: OliveVarieties
} 