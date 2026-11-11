
import { queryOptions } from "@tanstack/react-query";

import { getCurrentUser } from "./auth.api";
import { ApiRequestError } from "../../lib/apiClient";
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
          error instanceof ApiRequestError &&
          error.status === 401
        ) {
          return null;
        }

        throw error;
      }
    },

    retry: false,
  });
