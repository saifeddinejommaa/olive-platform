import type { ConstantsStorage } from "@olive-platform/core/features/appConstants/ConstantsStorage";

export const constantsStorage: ConstantsStorage = {
  getItem: (name) => {
    return localStorage.getItem(name);
  },

  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },

  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};