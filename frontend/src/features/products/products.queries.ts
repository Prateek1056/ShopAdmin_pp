
import { queryOptions } from "@tanstack/react-query";

import { getProducts, getProductById } from "./products.api";
import { queryKeys } from "../../lib/queryKeys";

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: [queryKeys.PRODUCTS],
    queryFn: getProducts,
  });

export const productByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [queryKeys.PRODUCTS, id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
