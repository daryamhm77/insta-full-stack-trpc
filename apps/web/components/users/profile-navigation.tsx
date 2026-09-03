"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProfileNavigation() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 border-b bg-[color:var(--bg-primary)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-8 py-4 sm:px-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
        >
          <Home className="size-6" />
        </Button>
      </div>
    </div>
  );
}
