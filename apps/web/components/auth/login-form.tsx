"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import Link from "next/link";
import { LogInSchema, type LogInSchemaType } from "@/lib/auth/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AuthDivider,
  AuthGoogleButton,
  AuthPrimaryButton,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";

interface LoginFormsProps {
  onSubmit: (
    data: LogInSchemaType,
    setError: UseFormSetError<LogInSchemaType>,
  ) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LogInSchemaType>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LogInSchemaType) => {
    setIsSubmitting(true);
    form.clearErrors("root");

    try {
      await onSubmit(data, form.setError);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormRootError className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600" />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={authLabelClassName}>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className={authInputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={authLabelClassName}>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Your password"
                  disabled={isSubmitting}
                  className={authInputClassName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AuthPrimaryButton disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in to your account"}
        </AuthPrimaryButton>

        <AuthDivider />

        <AuthGoogleButton
          label="Sign in with Google"
          disabled={isSubmitting}
          onClick={() =>
            form.setError("root", {
              message: "Google sign-in is not configured yet.",
            })
          }
        />

        <Link
          href="/signup"
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-zinc-900 bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Sign up
        </Link>
      </form>
    </Form>
  );
}
