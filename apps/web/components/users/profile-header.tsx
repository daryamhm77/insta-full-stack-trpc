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

const statClassName = "inline-flex items-center gap-1.5 text-sm leading-none";

const statButtonClassName = `${statClassName} h-auto min-h-0 rounded-none p-0 font-normal hover:bg-transparent`;

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
    <div className="mb-8 pl-2">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
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

        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-normal">{profile.name}</h1>
            <div className="flex gap-2">
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

          <div className="flex items-center gap-8 text-sm">
            <span className={statClassName}>
              <span className="font-semibold">{profile.postCount}</span>
              <span className="text-muted-foreground">posts</span>
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenFollowers}
              className={statButtonClassName}
            >
              <span className="font-semibold">{profile.followerCount}</span>
              <span className="text-muted-foreground">followers</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onOpenFollowing}
              className={statButtonClassName}
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
                className="flex items-center gap-1 text-sm text-primary hover:underline"
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
