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
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

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