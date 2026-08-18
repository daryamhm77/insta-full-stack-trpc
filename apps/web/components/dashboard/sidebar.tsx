"use client";

import { useState } from "react";
import { Camera, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/components/dashboard/avatar-upload";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";
import { getImageUrl } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const utils = trpc.useUtils();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload avatar");
    }

    const { filename } = (await uploadResponse.json()) as { filename: string };
    await authClient.updateUser({ image: filename });
    await utils.posts.findAll.invalidate();
  };

  const avatarUrl = session?.user.image
    ? getImageUrl(session.user.image)
    : "";

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="relative shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={session?.user.name ?? "Your profile"}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <User className="size-4 text-muted-foreground" />
              </div>
            )}
            <Button
              type="button"
              variant="default"
              size="icon-xs"
              title="Change avatar"
              className="absolute -right-1 -bottom-1 rounded-full"
              onClick={() => setShowAvatarModal(true)}
            >
              <Camera className="size-3" />
            </Button>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {session?.user.name ?? "Guest"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
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
              className="text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Suggestions for you
        </h3>
        <p className="text-sm text-muted-foreground">
          Follow suggestions coming soon.
        </p>
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
