export function buildQueryParams(filters: Record<string, any>){
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, String(value));
    }
  });

  return params.toString();
};