
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5029/api";

type ApiErrorResponse = {
  message?: string;
  title?: string;
  error?: string;
};

export class ApiRequestError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const responseText = await response.text();

  let result: unknown = null;

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }
  }

  if (!response.ok) {
    const errorData =
      result !== null && typeof result === "object"
        ? (result as ApiErrorResponse)
        : null;

    const message =
      errorData?.message ||
      errorData?.title ||
      errorData?.error ||
      (typeof result === "string" && result) ||
      `Request failed with status ${response.status}`;

    throw new ApiRequestError(message, response.status, result);
  }

  return result as T;
}
