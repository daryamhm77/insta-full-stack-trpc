"use client";

import { useState } from "react";
import { Camera, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/components/dashboard/avatar-upload";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { getImageUrl, uploadImage } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const utils = trpc.useUtils();
  const router = useRouter();

  const { data: suggestedUsers = [] } = trpc.users.getSuggestedUsers.useQuery();
  const followMutation = trpc.users.follow.useMutation({
    onSuccess: async () => {
      await utils.users.getSuggestedUsers.invalidate();
      await utils.posts.findAll.invalidate();
      await utils.stories.getStories.invalidate();
    },
  });

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAvatarUpload = async (file: File) => {
    const filename = await uploadImage(file);
    await authClient.updateUser({ image: filename });
    await utils.posts.findAll.invalidate();
  };

  const avatarUrl = session?.user.image
    ? getImageUrl(session.user.image)
    : "";

  return (
    <div className="space-y-6">
      <Card className="ice-card gap-0 p-5 pl-6 ring-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {session?.user.id ? (
              <Link href={`/users/${session.user.id}`}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={session.user.name ?? "Your profile"}
                    className="size-14 rounded-full object-cover ring-1 ring-[var(--border-soft)]"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-full bg-[var(--bg-card-soft)]">
                    <User className="size-4 text-[var(--text-muted)]" />
                  </div>
                )}
              </Link>
            ) : avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Your profile"
                className="size-14 rounded-full object-cover ring-1 ring-[var(--border-soft)]"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-[var(--bg-card-soft)]">
                <User className="size-4 text-[var(--text-muted)]" />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              title="Change avatar"
              className="absolute -right-1 -bottom-1 rounded-full"
              onClick={() => setShowAvatarModal(true)}
            >
              <Camera aria-hidden="true" className="size-3" />
            </Button>
          </div>

          <div className="min-w-0 flex-1">
            {session?.user.id ? (
              <Link
                href={`/users/${session.user.id}`}
                className="block truncate text-sm font-semibold text-[var(--text-primary)] hover:opacity-80"
              >
                {session.user.name ?? "Guest"}
              </Link>
            ) : (
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                Guest
              </p>
            )}
            <p className="truncate text-xs text-[var(--text-muted)]">
              {session?.user.email ?? "Not signed in"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Sign out"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="ice-card gap-0 p-5 pl-6 pr-5 ring-0">
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-muted)]">
          Suggestions for you
        </h3>
        {suggestedUsers.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No suggestions yet.</p>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((user) => {
              const suggestionAvatar = getImageUrl(user.image || "");

              return (
                <div key={user.id} className="flex items-center gap-2">
                  <Link
                    href={`/users/${user.id}`}
                    className="flex min-w-0 flex-1 items-center gap-2 hover:opacity-80"
                  >
                    {suggestionAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={suggestionAvatar}
                        alt={user.name}
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-card-soft)]">
                        <User className="size-4 text-[var(--text-muted)]" />
                      </div>
                    )}
                    <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {user.name}
                    </span>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="follow-button mr-2"
                    disabled={followMutation.isPending}
                    onClick={() => followMutation.mutate({ userId: user.id })}
                  >
                    Follow
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <AvatarUpload
        open={showAvatarModal}
        onOpenChange={setShowAvatarModal}
        onSubmit={handleAvatarUpload}
        currentAvatar={session?.user.image}
      />
    </div>
  );
}
