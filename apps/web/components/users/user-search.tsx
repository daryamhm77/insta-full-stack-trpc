"use client";

import { Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { getImageUrl } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface UserSearchProps {
  className?: string;
  inputClassName?: string;
}

export function UserSearch({ className, inputClassName }: UserSearchProps) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const searchQuery = trpc.users.searchUsers.useQuery(
    { query: debouncedQuery },
    {
      enabled: debouncedQuery.length >= 1,
    },
  );

  const results = searchQuery.data ?? [];
  const showDropdown = open && debouncedQuery.length >= 1;

  const handleSelect = (userId: string) => {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    router.push(`/users/${userId}`);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-sm", className)}>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
            if (event.key === "Enter" && results[0]) {
              event.preventDefault();
              handleSelect(results[0].id);
            }
          }}
          placeholder="Search users"
          aria-label="Search users by username"
          aria-expanded={showDropdown}
          aria-controls={listId}
          autoComplete="off"
          className={cn(
            "h-10 rounded-xl border-[var(--border-soft)] bg-[var(--bg-card)] pl-9 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            inputClassName,
          )}
        />
      </div>

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--bg-card)] shadow-[var(--shadow-soft)]"
        >
          {searchQuery.isLoading && (
            <p className="px-3 py-3 text-sm text-[var(--text-muted)]">
              Searching…
            </p>
          )}

          {!searchQuery.isLoading && results.length === 0 && (
            <p className="px-3 py-3 text-sm text-[var(--text-muted)]">
              No users found
            </p>
          )}

          {results.map((user) => {
              const avatarUrl = getImageUrl(user.image ?? "");
              return (
                <button
                  key={user.id}
                  type="button"
                  role="option"
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-card-soft)]"
                  onClick={() => handleSelect(user.id)}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt=""
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-[var(--bg-card-soft)]">
                      <User className="size-4 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {user.name}
                    </p>
                    {(user.bio || user.followerCount > 0) && (
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {user.bio?.trim()
                          ? user.bio
                          : `${user.followerCount} followers`}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
