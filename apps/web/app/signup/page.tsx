"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import SignupForm from "@/components/auth/signup-form";
import { authClient } from "@/lib/auth/auth-client";
import type { SignUpSchemaType } from "@/lib/auth/schema";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: SignUpSchemaType) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message ?? "Failed to create account");
    }

    const signInResult = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (signInResult.error) {
      throw new Error(
        signInResult.error.message ??
          "Account created, but sign-in failed. Try logging in.",
      );
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell
      title="Get started absolutely free."
      subtitle={
        <>
          Welcome to Insta, please enter your details below to create a new
          account.{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-800 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm onSubmit={handleSignup} />
    </AuthShell>
  );
}
