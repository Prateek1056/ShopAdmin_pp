
import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { authQueryOptions } from "../features/auth/auth.queries";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery(
      authQueryOptions()
    );

    if (!user) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: () => <Outlet />,
});