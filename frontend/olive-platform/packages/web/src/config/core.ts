import { configureCore } from "@olive-platform/core";

export function configureApplicationCore() {
  configureCore({
    apiBaseUrl: "http://localhost:7009/api/",
  });
}