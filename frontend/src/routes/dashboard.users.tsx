import { createFileRoute } from "@tanstack/react-router";
import Users from "../components/pages/Users";

export const Route = createFileRoute("/dashboard/users")({
  component: Users,
});