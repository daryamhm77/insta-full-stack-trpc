"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserSearch } from "@/components/users/user-search";

export function ProfileNavigation() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 border-b border-[var(--border-soft)] bg-[var(--bg-primary)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-8 py-4 sm:px-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          aria-label="Home"
        >
          <Home className="size-6" />
        </Button>
        <UserSearch className="flex-1" />
      </div>
    </div>
  );
}
