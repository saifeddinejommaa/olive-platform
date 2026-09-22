import { configureCore } from "@olive-platform/core";

export function configureApplicationCore() {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
 console.log("🔧 API URL =", apiBaseUrl);
  if (!apiBaseUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not configured.",
    );
  }

  configureCore({
    apiBaseUrl,
  });
}