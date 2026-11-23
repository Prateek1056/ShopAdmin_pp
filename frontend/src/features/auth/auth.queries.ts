
import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "./auth.api";
import { ApiError } from "../../types/api.type";
import { queryKeys } from "../../lib/queryKeys";

export const authQueryOptions = () =>
  queryOptions({
    queryKey: [queryKeys.AUTH_USER],

    queryFn: async () => {
      try {
        const response = await getCurrentUser();

        return response.data;
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.statusCode === 401
        ) {
          return null;
        }

        throw error;
      }
    },

    retry: false,
  });
  