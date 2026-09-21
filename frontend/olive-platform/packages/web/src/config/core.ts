import { configureCore } from "@olive-platform/core";

export function configureApplicationCore() {
  configureCore({
    apiBaseUrl: "https://localhost:7009/api/",
  });
}