
import { apiRequest } from "../../lib/apiClient";

import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";

export function loginUser(
  credentials: LoginRequest,
): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<ApiResponse<AuthResponse>>("/Login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(
  details: RegisterRequest,
): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<ApiResponse<boolean>>("/Register", {
    method: "POST",
    body: JSON.stringify(details),
  });

  if (!response.success) {
    throw new Error(response.message || "Registration failed.");
  }

  return response;
}
