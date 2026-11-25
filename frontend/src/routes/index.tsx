
import { createFileRoute, redirect } from "@tanstack/react-router";

import HomePage from "../storefront/pages/HomePage";
import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(
      authQueryOptions(),
    );

    if (user?.role === "Admin") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },

  component: HomePage,
});
