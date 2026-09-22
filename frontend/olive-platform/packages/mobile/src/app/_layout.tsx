import { Stack } from 'expo-router';
import { configureApplicationCore } from '../config/core';

export default function RootLayout() {
  configureApplicationCore();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}