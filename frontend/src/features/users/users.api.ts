
import { apiRequest } from "../../lib/apiClient";

import type {
  ApiResponse,
  UserDto,
  SaveUserRequest,
  DeleteUserRequest,
} from "./users.types";

// GET ALL USERS
export async function getAllUsers(): Promise<ApiResponse<UserDto[]>> {
  const response = await apiRequest<ApiResponse<UserDto[]>>(
    "/User/GetAll",
    {
      method: "GET",
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to retrieve users.");
  }

  return response;
}

// GET USER BY ID
export async function getUserById(
  id: string
): Promise<ApiResponse<UserDto>> {
  const response = await apiRequest<ApiResponse<UserDto>>(
    `/User/GetById/${encodeURIComponent(id)}`,
    {
      method: "GET",
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to retrieve user.");
  }

  return response;
}

// CREATE OR UPDATE USER
export async function saveUser(
  details: SaveUserRequest
): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<ApiResponse<boolean>>(
    "/User/Save",
    {
      method: "POST",
      body: JSON.stringify(details),
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to save user.");
  }

  return response;
}

// DELETE USER
export async function deleteUser(
  details: DeleteUserRequest
): Promise<ApiResponse<boolean>> {
  const response = await apiRequest<ApiResponse<boolean>>(
    "/User/Delete",
    {
      method: "POST",
      body: JSON.stringify(details),
    }
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to delete user.");
  }

  return response;
}
