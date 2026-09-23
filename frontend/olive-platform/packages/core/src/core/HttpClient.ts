import { getCoreConfig } from "../config/CoreConfiguration";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
};

export type ApiResponse<T> = {
  Code: number;
  Response: T;
  ResponseMessage: string;
};

export async function http<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { apiBaseUrl } = getCoreConfig();
  

  const { method = "GET", body, headers = {} } = options;
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
