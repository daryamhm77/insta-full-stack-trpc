"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { SignUpSchema, type SignUpSchemaType } from "@/lib/auth/schema";
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
  PasswordStrengthHint,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  onSubmit: (data: SignUpSchemaType) => Promise<void>;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = form.watch("password");

  const handleSubmit = async (data: SignUpSchemaType) => {
    setIsSubmitting(true);
    form.clearErrors("root");

    try {
      await onSubmit(data);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={authLabelClassName}>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
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
                <div className="relative">
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    disabled={isSubmitting}
                    className={cn(authInputClassName, "pr-24")}
                    {...field}
                  />
                  <PasswordStrengthHint password={passwordValue} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="gap-1.5">
              <FormLabel className={authLabelClassName}>
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
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
          {isSubmitting ? "Creating account..." : "Create my account"}
        </AuthPrimaryButton>

        <AuthDivider />

        <AuthGoogleButton
          label="Sign up with Google"
          disabled={isSubmitting}
          onClick={() =>
            form.setError("root", {
              message: "Google sign-up is not configured yet.",
            })
          }
        />

        <Link
          href="/login"
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-zinc-900 bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Log in
        </Link>
      </form>
    </Form>
  );
}
