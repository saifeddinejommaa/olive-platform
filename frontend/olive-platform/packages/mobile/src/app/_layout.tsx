import { Stack } from 'expo-router';
import { configureApplicationCore } from '../config/core';
import { setAppConstants } from '@olive-platform/core/features/appConstants/helper/AppConstantsHelper';
import { useConstantsStore } from '../stores/ConstantsStore';

export default function RootLayout() {
  configureApplicationCore();
  setAppConstants(
  useConstantsStore.getState().Appconstants
);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}