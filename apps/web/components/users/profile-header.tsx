"use client";

import type { UserProfile } from "@repo/trpc/schemas";
import { Edit, Globe, Settings, User } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowToggle: () => void;
  onEditProfile: () => void;
  onOpenFollowers: () => void;
  isOwnProfile: boolean;
  onOpenFollowing: () => void;
  isFollowLoading: boolean;
}

export default function ProfileHeader({
  profile,
  onFollowToggle,
  isOwnProfile,
  onEditProfile,
  onOpenFollowers,
  onOpenFollowing,
  isFollowLoading,
}: ProfileHeaderProps) {
  const avatarUrl = getImageUrl(profile.image || "");

  return (
    <div className="mb-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <div className="shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={profile.name}
              className="size-32 rounded-full border-2 object-cover md:size-40"
            />
          ) : (
            <div className="flex size-32 items-center justify-center rounded-full border-2 bg-muted md:size-40">
              <User className="size-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 text-center sm:items-start sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <h1 className="text-2xl font-normal">{profile.name}</h1>
            <div className="flex items-center gap-2">
              {!isOwnProfile && (
                <Button
                  type="button"
                  variant="outline"
                  className="follow-button"
                  onClick={onFollowToggle}
                  disabled={isFollowLoading}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              )}

              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="ghost" size="icon" />
                    }
                  >
                    <Settings aria-hidden="true" className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEditProfile}>
                      <Edit className="mr-2 size-4" />
                      Edit Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm sm:justify-start">
            <div className="inline-flex items-center gap-1">
              <span className="font-semibold">{profile.postCount}</span>
              <span className="text-muted-foreground">posts</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenFollowers}
              className="inline-flex h-auto min-h-0 items-center gap-1 p-0 text-sm font-normal hover:bg-transparent"
            >
              <span className="font-semibold">{profile.followerCount}</span>
              <span className="text-muted-foreground">followers</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenFollowing}
              className="inline-flex h-auto min-h-0 items-center gap-1 p-0 text-sm font-normal hover:bg-transparent"
            >
              <span className="font-semibold">{profile.followingCount}</span>
              <span className="text-muted-foreground">following</span>
            </Button>
          </div>

          <div className="space-y-1">
            {profile.bio && (
              <div className="text-sm whitespace-pre-wrap">{profile.bio}</div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Globe className="size-3" />
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
