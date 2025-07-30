import { AuthLayout } from "~/components/common/layouts/auth-layout";
import { SignUpPageClient } from "./client";

export default function SignUpPage() {

  return (
    <AuthLayout
      heading="Sign Up"
      subheading="Enter your credentials to access your account"
      backLink={{
        href: "/auth/sign-in",
        label: "Already have an account? Sign in",
      }}
    >
      <SignUpPageClient />
    </AuthLayout>
  );
}
