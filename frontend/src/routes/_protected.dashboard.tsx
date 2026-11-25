import { createFileRoute, redirect } from "@tanstack/react-router";

import DashboardLayout from "../components/layout/DashboardLayout";
import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/_protected/dashboard")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions());

    if (user?.role !== "Admin") {
      throw redirect({
        to: "/",
      });
    }
  },

  component: DashboardLayout,
});
