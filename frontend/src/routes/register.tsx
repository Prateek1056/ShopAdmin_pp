
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { registerUser } from "../features/auth/auth.api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [registered, setRegistered] = useState(false);

  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      gender: 0,
      dateofBirth: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
      },
    },
    onSubmit: async ({ value }) => {
      setRegistered(false);
      registerMutation.reset();

      try {
        await registerMutation.mutateAsync(value);
        setRegistered(true);
      } catch {
        // The mutation error is displayed below the form.
      }
    },
  });

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>

        <p className="mb-8 mt-2 text-center text-gray-500">
          Register for your ShopAdmin account
        </p>

        {registered && (
          <div
            role="status"
            className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700"
          >
            Registration successful! You can now{" "}
            <Link to="/login" className="font-semibold underline">
              sign in
            </Link>
            .
          </div>
        )}

        {registerMutation.isError && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {registerMutation.error.message || "Registration failed."}
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field
              name="name"
              validators={{
                onBlur: ({ value }) =>
                  !value.trim() ? "Full name is required." : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id={field.name}
                    className={inputClass}
                    autoComplete="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="Enter your full name"
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
                  <label htmlFor={field.name} className={labelClass}>
                    Email address *
                  </label>
                  <input
                    id={field.name}
                    type="email"
                    className={inputClass}
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="you@example.com"
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
                  !value
                    ? "Password is required."
                    : value.length < 8
                      ? "Password must contain at least 8 characters."
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelClass}>
                    Password *
                  </label>
                  <input
                    id={field.name}
                    type="password"
                    className={inputClass}
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="At least 8 characters"
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
              name="contactNumber"
              validators={{
                onBlur: ({ value }) =>
                  !value.trim()
                    ? "Contact number is required."
                    : !/^\+?[0-9]{10,15}$/.test(value.trim())
                      ? "Enter a valid contact number."
                      : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelClass}>
                    Contact number *
                  </label>
                  <input
                    id={field.name}
                    type="tel"
                    className={inputClass}
                    autoComplete="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="Enter contact number"
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">
                      {String(error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="gender">
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelClass}>
                    Gender
                  </label>
                  <select
                    id={field.name}
                    className={inputClass}
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(Number(event.target.value))
                    }
                  >
                    <option value={0}>Select gender</option>
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                    <option value={3}>Other</option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field
              name="dateofBirth"
              validators={{
                onBlur: ({ value }) =>
                  !value ? "Date of birth is required." : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className={labelClass}>
                    Date of birth *
                  </label>
                  <input
                    id={field.name}
                    type="date"
                    className={inputClass}
                    value={field.state.value}
                    max={new Date().toISOString().split("T")[0]}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                  />
                  {field.state.meta.errors.map((error, index) => (
                    <p key={index} className="mt-1 text-sm text-red-600">
                      {String(error)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Address details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <form.Field
                name="address.addressLine1"
                validators={{
                  onBlur: ({ value }) =>
                    !value.trim() ? "Address line 1 is required." : undefined,
                }}
              >
                {(field) => (
                  <div className="sm:col-span-2">
                    <label htmlFor={field.name} className={labelClass}>
                      Address line 1 *
                    </label>
                    <input
                      id={field.name}
                      className={inputClass}
                      autoComplete="address-line1"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="House number, street, area"
                    />
                    {field.state.meta.errors.map((error, index) => (
                      <p key={index} className="mt-1 text-sm text-red-600">
                        {String(error)}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>

              <form.Field name="address.addressLine2">
                {(field) => (
                  <div className="sm:col-span-2">
                    <label htmlFor={field.name} className={labelClass}>
                      Address line 2 (optional)
                    </label>
                    <input
                      id={field.name}
                      className={inputClass}
                      autoComplete="address-line2"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Apartment, landmark, etc."
                    />
                  </div>
                )}
              </form.Field>

              {(
                [
                  ["city", "City", "address-level2"],
                  ["state", "State", "address-level1"],
                  ["country", "Country", "country-name"],
                  ["pinCode", "PIN code", "postal-code"],
                ] as const
              ).map(([key, label, autoComplete]) => (
                <form.Field
                  key={key}
                  name={`address.${key}`}
                  validators={{
                    onBlur: ({ value }) =>
                      !value.trim() ? `${label} is required.` : undefined,
                  }}
                >
                  {(field) => (
                    <div>
                      <label htmlFor={field.name} className={labelClass}>
                        {label} *
                      </label>
                      <input
                        id={field.name}
                        className={inputClass}
                        autoComplete={autoComplete}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                      {field.state.meta.errors.map((error, index) => (
                        <p key={index} className="mt-1 text-sm text-red-600">
                          {String(error)}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending || registered}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {registerMutation.isPending
              ? "Creating account..."
              : registered
                ? "Account created"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
