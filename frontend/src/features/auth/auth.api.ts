
import { apiRequest } from "../../lib/apiUtility";

import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  CurrentUserDto,
} from "./auth.types";

export function loginUser(
  credentials: LoginRequest,
): Promise<ApiResponse<boolean>> {
  return apiRequest<ApiResponse<boolean>>(
    "/Login",
    {
      method: "POST",
      data: credentials,
    },
  );
}

export async function logoutUser(): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<ApiResponse<boolean>>(
    "/Login/logout",
    {
      method: "POST",
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Logout failed.");
  }

  return response;
}

export async function registerUser(
  details: RegisterRequest,
): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<ApiResponse<boolean>>(
    "/Register",
    {
      method: "POST",
      data: details,
    },
  );

  if (!response.success) {
    throw new Error(response.message || "Registration failed.");
  }

  return response;
}

export async function getCurrentUser(): Promise<
  ApiResponse<CurrentUserDto>
> {
  const response = await apiRequest<
    ApiResponse<CurrentUserDto>
  >(
    "/Login/me",
    {
      method: "GET",
    },
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Unable to retrieve current user.",
    );
  }

  return response;
}
