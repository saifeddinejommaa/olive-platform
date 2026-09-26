import { getCoreConfig } from "../config/CoreConfiguration";
import { getSelectedSeasonId } from "./SeasonContext";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  // Ajoute la campagne sélectionnée à l'appel (true par défaut).
  withSeason?: boolean;
};

export type ApiResponse<T> = {
  Code: number;
  Response: T;
  ResponseMessage: string;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  Object.getPrototypeOf(value) === Object.prototype;

// seasonId en query string (filtres des listes) et dans le corps (création).
function applySeason(path: string, body: any, seasonId: number) {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);

  if (!params.has("seasonId")) {
    params.set("seasonId", String(seasonId));
  }

  const nextBody =
    isPlainObject(body) && body.seasonId == null
      ? { ...body, seasonId }
      : body;

  return {
    path: `${pathname}?${params.toString()}`,
    body: nextBody,
  };
}

export async function http<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { apiBaseUrl } = getCoreConfig();

  const { method = "GET", headers = {}, withSeason = true } = options;
  let { body } = options;

  const seasonId = withSeason ? getSelectedSeasonId() : null;

  if (seasonId != null) {
    ({ path, body } = applySeason(path, body, seasonId));
  }

  const url = `${apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const isGet = method.toUpperCase() === "GET";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: !isGet && body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw {
      code: data?.Code ?? response.status,
      message: data?.ResponseMessage ?? "HTTP Error",
      data: data?.Response ?? null,
    };
  }

  return data as T;
}
