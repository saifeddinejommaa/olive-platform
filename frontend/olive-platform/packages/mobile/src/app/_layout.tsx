import { Stack } from 'expo-router';
import { configureApplicationCore } from '../config/core';
import { setAppConstants } from '@olive-platform/core/features/appConstants/helper/AppConstantsHelper';
import { useConstantsStore } from '../stores/ConstantsStore';
import { SeasonGate } from '../components/SeasonGate';

export default function RootLayout() {
  configureApplicationCore();
  setAppConstants(
  useConstantsStore.getState().Appconstants
);

  return (
    <SeasonGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SeasonGate>
  );
}