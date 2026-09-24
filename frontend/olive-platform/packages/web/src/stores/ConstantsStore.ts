import { createConstantsStore } from "@olive-platform/core/features/appConstants/ConstantsStore";

import { constantsStorage } from "../config/constantsStorage";

export const useConstantsStore =
  createConstantsStore(constantsStorage);