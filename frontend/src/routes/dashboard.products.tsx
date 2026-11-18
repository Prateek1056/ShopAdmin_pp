import { createFileRoute } from "@tanstack/react-router";
import Products from "../components/pages/Products";

export const Route = createFileRoute("/dashboard/products")({
  component: Products,
});