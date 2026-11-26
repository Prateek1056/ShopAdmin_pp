
import { ApiUtility } from "../../lib/apiUtility";

import type {
  Product,
  CreateProductRequestDto,
  UpdateProductRequestDto,
  DeleteProductRequestDto,
} from "./products.types";

export const getProducts = async (): Promise<Product[]> => {
  return ApiUtility.get<Product[]>("/Product/GetAll");
};

export const getProductById = async (
  id: string,
): Promise<Product> => {
  return ApiUtility.get<Product>(`/Product/${id}`);
};

export const createProduct = async (
  request: CreateProductRequestDto,
): Promise<boolean> => {
  return ApiUtility.post<boolean>("/Product", request);
};

export const updateProduct = async (
  request: UpdateProductRequestDto,
): Promise<boolean> => {
  return ApiUtility.post<boolean>("/Product/Update", request);
};

export const deleteProduct = async (
  request: DeleteProductRequestDto,
): Promise<boolean> => {
  return ApiUtility.post<boolean>("/Product/Delete", request);
};
