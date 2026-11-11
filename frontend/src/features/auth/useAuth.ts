
import { useQuery } from "@tanstack/react-query";

import { authQueryOptions } from "./auth.queries";

export function useAuth() {
  const query = useQuery(authQueryOptions());

  return {
    user: query.data ?? null,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
