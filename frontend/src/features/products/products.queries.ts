
import { queryOptions } from "@tanstack/react-query";

import { getProducts, getProductById } from "./products.api";
import { queryKeys } from "../../lib/queryKeys";

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: [queryKeys.PRODUCTS],
    queryFn: async () => {
      const response = await getProducts();
      return response.data;
    },
  });

export const productByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [queryKeys.PRODUCTS, id],
    queryFn: async () => {
      const response = await getProductById(id);
      return response.data;
    },
    enabled: !!id,
  });
