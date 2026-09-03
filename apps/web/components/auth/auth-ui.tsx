"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthDivider() {
  return (
    <div className="relative my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#a76d60]/25 dark:bg-[#e0d0c1]/25" />
      <span className="text-xs font-medium tracking-wide text-[#8a6e66] uppercase dark:text-[#a89082]">
        OR
      </span>
      <div className="h-px flex-1 bg-[#a76d60]/25 dark:bg-[#e0d0c1]/25" />
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface AuthGoogleButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function AuthGoogleButton({
  label,
  disabled,
  onClick,
}: AuthGoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className="h-12 w-full rounded-xl border-[#a76d60]/40 bg-[#f7f1ea] font-semibold text-[#2f201c] hover:bg-[#ede0d3] hover:text-[#2f201c] dark:border-[#e0d0c1]/35 dark:bg-[#523a33] dark:text-[#e0d0c1] dark:hover:bg-[#5c433b]"
    >
      <GoogleIcon />
      {label}
    </Button>
  );
}

export function AuthPrimaryButton({
  children,
  disabled,
  type = "submit",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <Button
      type={type}
      variant="default"
      disabled={disabled}
      className="mt-2 h-12 w-full rounded-xl bg-[#a76d60] font-semibold text-[#f7f1ea] hover:bg-[#8b574c] hover:text-[#f7f1ea] dark:bg-[#e0d0c1] dark:text-[#2f201c] dark:hover:bg-[#c9b5a3] dark:hover:text-[#2f201c]"
    >
      {children}
    </Button>
  );
}

export const authInputClassName =
  "h-12 rounded-xl border-[#a76d60]/30 bg-[#f7f1ea] px-3.5 text-sm text-[#2f201c] placeholder:text-[#8a6e66] focus-visible:border-[#a76d60] focus-visible:ring-[#a76d60]/25 dark:border-[#e0d0c1]/25 dark:bg-[#523a33] dark:text-[#e0d0c1] dark:placeholder:text-[#a89082]";

export const authLabelClassName =
  "text-[0.8rem] font-medium text-[#6b4e47] dark:text-[#c9b5a3]";

type Strength = "empty" | "weak" | "fair" | "strong";

export function getPasswordStrength(password: string): Strength {
  if (!password) return "empty";

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}

export function PasswordStrengthHint({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (strength === "empty") return null;

  const config = {
    weak: {
      label: "Weak",
      color: "text-red-500",
      bars: "bg-red-400",
      count: 1,
    },
    fair: {
      label: "Fair",
      color: "text-amber-500",
      bars: "bg-amber-400",
      count: 2,
    },
    strong: {
      label: "Strong",
      color: "text-emerald-500",
      bars: "bg-emerald-400",
      count: 3,
    },
  }[strength];

  return (
    <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              "h-0.5 w-3 rounded-full",
              index < config.count ? config.bars : "bg-zinc-200",
            )}
          />
        ))}
      </div>
      <span className={cn("text-xs font-medium", config.color)}>
        {config.label}
      </span>
    </div>
  );
}
