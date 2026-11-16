
import { useQuery } from "@tanstack/react-query";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { productsQueryOptions } from "../../features/products/products.queries";

export default function HomePage() {
  const {
    data: products = [],
    isPending,
    isError,
    error,
  } = useQuery(productsQueryOptions());

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <HeroSection />

      {/* Featured Products */}
      <section
        id="featured"
        className="mx-auto max-w-7xl px-6 py-20"
      >
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
            Our Collection
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured Products
          </h2>

          <p className="mt-3 text-gray-500">
            Discover products selected for your everyday lifestyle.
          </p>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-square rounded-2xl bg-gray-100" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
                <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-700">
              Unable to load products
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        {/* Success State */}
        {!isPending && !isError && (
          <>
            {products.length === 0 ? (
              <p className="py-12 text-center text-gray-500">
                No products are available right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          Image unavailable
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        {product.category}
                      </p>

                      <h3 className="mt-2 font-medium text-gray-900">
                        {product.name}
                      </h3>

                      <p className="mt-2 font-semibold text-gray-900">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {product.stockQuantity > 0
                          ? "In stock"
                          : "Out of stock"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}