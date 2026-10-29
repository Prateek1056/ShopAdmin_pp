
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { loginUser } from "../features/auth/auth.api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (!response.success || !response.data?.accessToken) {
        throw new Error(response.message || "Login failed.");
      }

      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);

      navigate({ to: "/dashboard" });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      loginMutation.reset();
      await loginMutation.mutateAsync(value);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          ShopAdmin
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Sign in to your account
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) =>
                !value.trim()
                  ? "Email is required."
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? "Enter a valid email address."
                    : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <input
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {field.state.meta.errors.map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">
                    {String(error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) =>
                !value ? "Password is required." : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {field.state.meta.errors.map((error, index) => (
                  <p key={index} className="mt-1 text-sm text-red-600">
                    {String(error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {loginMutation.isError && (
            <p role="alert" className="text-sm text-red-600">
              {loginMutation.error.message || "Unable to sign in."}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
