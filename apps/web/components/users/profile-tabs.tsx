"use client";

import type { Post } from "@repo/trpc/schemas";
import { Bookmark, Grid } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import EmptyState from "./empty-state";
import { PostsGrid } from "./posts-grid";

interface ProfileTabsProps {
  userPosts: Post[];
  savedPosts: Post[];
  isOwnProfile: boolean;
  name: string;
  onPostClick: (post: Post) => void;
}

export function ProfileTabs({
  userPosts,
  savedPosts,
  isOwnProfile,
  name,
  onPostClick,
}: ProfileTabsProps) {
  const [tab, setTab] = useState<"posts" | "saved">("posts");

  return (
    <div className="w-full">
      <div className="flex justify-start gap-1 border-t">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={cn(
            "inline-flex items-center gap-2 border-t-2 px-4 py-3 text-sm font-medium",
            tab === "posts"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground",
          )}
        >
          <Grid className="size-4" />
          POSTS
        </button>
        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setTab("saved")}
            className={cn(
              "inline-flex items-center gap-2 border-t-2 px-4 py-3 text-sm font-medium",
              tab === "saved"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            <Bookmark className="size-4" />
            SAVED
          </button>
        )}
      </div>

      <div className="mt-6">
        {tab === "posts" &&
          (userPosts.length === 0 ? (
            <EmptyState
              icon={Grid}
              title="No Posts Yet"
              description={`When ${name} shares photos, they'll appear here.`}
            />
          ) : (
            <PostsGrid posts={userPosts} onPostClick={onPostClick} />
          ))}

        {isOwnProfile &&
          tab === "saved" &&
          (savedPosts.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Posts"
              description="Save photos and videos to see them here."
            />
          ) : (
            <PostsGrid posts={savedPosts} onPostClick={onPostClick} />
          ))}
      </div>
    </div>
  );
}
