
import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router";

import Users from "../components/pages/Users";
import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/_protected/dashboard/users")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      authQueryOptions()
    );

    // Only Admin can access the Users page
    if (!user || user.role !== "Admin") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },

  component: Users,
});
