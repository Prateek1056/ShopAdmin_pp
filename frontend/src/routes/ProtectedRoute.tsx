
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { authQueryOptions } from "../features/auth/auth.queries";

export default function ProtectedRoute() {
  const {
    data: user,
    isLoading,
  } = useQuery(authQueryOptions());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
