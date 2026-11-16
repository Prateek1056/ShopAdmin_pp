
import { apiRequest } from "../../lib/apiClient";
import type { ApiResponse, Product } from "./products.types";

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  return apiRequest<ApiResponse<Product[]>>("/Product");
};

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  return apiRequest<ApiResponse<Product>>(`/Product/${id}`);
};
