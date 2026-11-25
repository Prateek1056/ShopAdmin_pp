import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  productsQueryOptions,
  productByIdQueryOptions,
} from "./products.queries";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.api";

import type {
  CreateProductRequestDto,
  UpdateProductRequestDto,
  DeleteProductRequestDto,
} from "./products.types";

import { queryKeys } from "../../lib/queryKeys";

// GET: All Products
export function useProducts() {
  return useQuery(productsQueryOptions());
}

// GET: Product By ID
export function useProductById(id: string) {
  return useQuery(productByIdQueryOptions(id));
}

// POST: Create Product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductRequestDto) =>
      createProduct(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.PRODUCTS],
      });
    },
  });
}

// POST: Update Product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProductRequestDto) =>
      updateProduct(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.PRODUCTS],
      });
    },
  });
}

// POST: Delete Product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteProductRequestDto) =>
      deleteProduct(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.PRODUCTS],
      });
    },
  });
}
