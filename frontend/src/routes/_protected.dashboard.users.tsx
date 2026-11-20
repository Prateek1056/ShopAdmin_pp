import { createFileRoute } from "@tanstack/react-router";
import Users from "../components/pages/Users";

export const Route = createFileRoute("/_protected/dashboard/users")({
  component: Users,
});