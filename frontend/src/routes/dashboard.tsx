import { createFileRoute, redirect } from "@tanstack/react-router";

import DashboardLayout from "../components/layout/DashboardLayout";
import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions());

    if (!user) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: DashboardLayout,
});
