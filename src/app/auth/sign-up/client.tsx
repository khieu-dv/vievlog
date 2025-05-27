"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "~/lib/auth-client";

export function SignUpPageClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the specific field error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.passwordConfirm) {
      setErrors({ passwordConfirm: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      await signUp(formData);
      router.push("/auth/sign-in?registered=true");
    } catch (err: any) {
      console.error("Signup error:", err);

      try {
        // Parse the error if it's a string
        let errorResponse = err;
        if (typeof err === 'string') {
          try {
            errorResponse = JSON.parse(err);
          } catch (parseError) {
            console.error("Failed to parse error string:", parseError);
          }
        }

        // Extract field-specific errors
        const fieldErrors: Record<string, string> = {};

        // Check if the error has data field with validation errors
        if (errorResponse?.data) {
          console.log("Error data123:", errorResponse.data);
          // Directly access the message in each field
          Object.entries(errorResponse.data.data || {}).forEach(([field, fieldError]) => {
            console.log("Raw fieldError:", field, fieldError);
            if (
              fieldError &&
              typeof fieldError === 'object' &&
              'message' in fieldError
            ) {
              fieldErrors[field] = fieldError.message as string;
            }
          });
        }

        // If we found specific field errors, use them
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          // Otherwise fall back to the general error message
          setErrors({ general: errorResponse?.message || "Registration failed. Please try again." });
        }
      } catch (handlingError) {
        // If error handling itself fails, use a generic message
        console.error("Error while handling error response:", handlingError);
        setErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 min-h-screen">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </div>

        {errors.general && (
          <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none ${errors.username ? "border-red-500" : ""
                }`}
              placeholder="test_username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none ${errors.email ? "border-red-500" : ""
                }`}
              placeholder="test@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none ${errors.password ? "border-red-500" : ""
                }`}
              placeholder="********"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none ${errors.passwordConfirm ? "border-red-500" : ""
                }`}
              placeholder="********"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="/auth/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}