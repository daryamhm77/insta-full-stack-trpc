"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { getImageUrl } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FollowersFollowingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  type: "followers" | "following";
}

export function FollowersFollowingModal({
  open,
  onOpenChange,
  userId,
  type,
}: FollowersFollowingModalProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const utils = trpc.useUtils();

  const { data: followers = [] } = trpc.users.getFollowers.useQuery(
    { userId },
    { enabled: open && type === "followers" },
  );
  const { data: following = [] } = trpc.users.getFollowing.useQuery(
    { userId },
    { enabled: open && type === "following" },
  );

  const followMutation = trpc.users.follow.useMutation({
    onSuccess: async () => {
      await utils.users.getFollowers.invalidate({ userId });
      await utils.users.getFollowing.invalidate({ userId });
      await utils.users.getUserProfile.invalidate({ userId });
    },
  });

  const unfollowMutation = trpc.users.unfollow.useMutation({
    onSuccess: async () => {
      await utils.users.getFollowers.invalidate({ userId });
      await utils.users.getFollowing.invalidate({ userId });
      await utils.users.getUserProfile.invalidate({ userId });
    },
  });

  const users = type === "followers" ? followers : following;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {users.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No {type === "followers" ? "followers" : "following"} yet
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => {
                const avatarUrl = getImageUrl(user.image || "");

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        router.push(`/users/${user.id}`);
                        onOpenChange(false);
                      }}
                      className="h-auto flex-1 justify-start gap-3 p-0"
                    >
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={user.name}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <User className="size-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-semibold">
                          {user.name}
                        </div>
                        {user.bio && (
                          <div className="truncate text-xs text-muted-foreground">
                            {user.bio}
                          </div>
                        )}
                      </div>
                    </Button>
                    {session?.user.id !== user.id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (user.isFollowing) {
                            unfollowMutation.mutate({ userId: user.id });
                          } else {
                            followMutation.mutate({ userId: user.id });
                          }
                        }}
                        disabled={
                          followMutation.isPending || unfollowMutation.isPending
                        }
                        className="shrink-0"
                      >
                        {user.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
