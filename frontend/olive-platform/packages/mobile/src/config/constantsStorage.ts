import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ConstantsStorage } from "@olive-platform/core/features/appConstants/ConstantsStorage";

export const constantsStorage: ConstantsStorage = {
  getItem: async (name) => {
    return AsyncStorage.getItem(name);
  },

  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },

  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};