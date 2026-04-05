export type ApiResult<T> = {
  ok: boolean;
  message?: string;
  data?: T;
  issues?: Record<string, unknown>;
};

export async function postJson<T>(
  url: string,
  body: unknown,
): Promise<ApiResult<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return (await response.json()) as ApiResult<T>;
}
