"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UseFormSetError } from "react-hook-form";
import { AuthShell } from "@/components/auth/auth-shell";
import LoginForm from "@/components/auth/login-form";
import { authClient } from "@/lib/auth/auth-client";
import type { LogInSchemaType } from "@/lib/auth/schema";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (
    data: LogInSchemaType,
    setError: UseFormSetError<LogInSchemaType>,
  ) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("root", {
        message:
          error.message ?? "Invalid email or password. Please try again.",
      });
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle={
        <>
          Sign in to your Insta account to keep sharing with your community.{" "}
          <Link
            href="/signup"
            className="font-semibold text-zinc-900 underline underline-offset-4"
          >
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthShell>
  );
}
