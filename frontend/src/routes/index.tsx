
import { createFileRoute, redirect } from "@tanstack/react-router";

import HomePage from "../storefront/pages/HomePage";
import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(
      authQueryOptions(),
    );

    // Redirect every authenticated user to the dashboard.
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },

  component: HomePage,
});
