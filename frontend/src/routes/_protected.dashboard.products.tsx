import { createFileRoute } from "@tanstack/react-router";
import Products from "../components/pages/Products";

export const Route = createFileRoute("/_protected/dashboard/products")({
  component: Products,
});