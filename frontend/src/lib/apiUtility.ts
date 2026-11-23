
import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  ApiError,
  type ApiResponse,
} from "../types/api.type";

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5029/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function toApiError(error: unknown): ApiError {
  // IMPORTANT: Preserve an ApiError that was already converted.
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const body = error.response?.data as
      | ApiResponse<unknown>
      | undefined;

    return new ApiError(
      body?.message || error.message || "Something went wrong",
      error.response?.status ?? 500,
      body?.errors ?? null,
    );
  }

  return new ApiError("Something went wrong", 500);
}

// Shared refresh request for simultaneous 401 responses.
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(toApiError(error));
    }

    const originalRequest =
      error.config as RetryableRequestConfig;

    const url = originalRequest.url?.toLowerCase() ?? "";

    const isLoginEndpoint = url.endsWith("/login");
    const isRefreshEndpoint = url.endsWith("/login/refresh");
    const isLogoutEndpoint = url.endsWith("/login/logout");

    const isAuthEndpoint =
      isLoginEndpoint ||
      isRefreshEndpoint ||
      isLogoutEndpoint;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(toApiError(error));
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axiosInstance
          .post("/Login/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      // Retry the original request after successful refresh.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(toApiError(refreshError));
    }
  },
);

// Raw API request: preserves the backend ApiResponse<T>.
export async function apiRequest<T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url,
      ...config,
    });

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

function unwrap<T>(body: ApiResponse<T>): T {
  if (!body.success) {
    throw new ApiError(
      body.message || "Request failed",
      200,
      body.errors ?? null,
    );
  }

  return body.data as T;
}

export const ApiUtility = {
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await apiRequest<ApiResponse<T>>(
      url,
      {
        ...config,
        method: "GET",
      },
    );

    return unwrap(response);
  },

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await apiRequest<ApiResponse<T>>(
      url,
      {
        ...config,
        method: "POST",
        data,
      },
    );

    return unwrap(response);
  },
};

export { axiosInstance };
