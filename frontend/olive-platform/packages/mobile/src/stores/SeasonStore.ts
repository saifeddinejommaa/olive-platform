import { createSeasonStore } from "@olive-platform/core/features/seasons/SeasonStore";

import { constantsStorage } from "../config/constantsStorage";

export const useSeasonStore = createSeasonStore(constantsStorage);
