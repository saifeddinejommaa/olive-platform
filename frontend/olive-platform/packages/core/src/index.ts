/**
 * Public entry point of the shared core package.
 *
 * Cross-package (web / mobile) code should import from the package name, e.g.
 *   import { GetPlots } from "@olive-platform/core/features/plots/domain/usecases/GetPlots";
 *
 * This barrel only exposes the shared infrastructure primitives.
 */

export { http } from "./core/HttpClient";
export type { ApiResponse } from "./core/HttpClient";

export type { PagedResult } from "./core/PagedResult";
export type { PaginationFilter } from "./core/PaginationFilter";
export { buildQueryParams } from "./core/QueryUtils";
export type { CoreConfig } from './config/CoreConfig';

export {
configureCore,
getCoreConfig,
} from './config/CoreConfiguration';
