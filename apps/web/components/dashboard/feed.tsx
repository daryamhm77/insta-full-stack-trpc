"use client";

import type { Post } from "@repo/trpc/schemas";
import { Heart, MessageCircle, User } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeedProps {
  posts: Post[];
  isLoading?: boolean;
  onLikePost: (postId: number) => void;
}

export default function Feed({ posts, isLoading, onLikePost }: FeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((key) => (
          <Card key={key} className="overflow-hidden py-0">
            <div className="h-12 animate-pulse bg-muted" />
            <div className="aspect-square animate-pulse bg-muted/70" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-16 text-center">
        <p className="text-sm font-medium">No posts yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first post to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const avatarUrl = getImageUrl(post.user.avatar);
        const imageUrl = getImageUrl(post.image);

        return (
          <Card key={post.id} className="overflow-hidden py-0 gap-0">
            <div className="flex items-center gap-3 px-4 py-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={post.user.username}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <User className="size-4 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm font-semibold">{post.user.username}</span>
            </div>

            <div className="relative aspect-square bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={post.caption}
                className="size-full object-cover"
              />
            </div>

            <CardContent className="space-y-2 py-4">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onLikePost(post.id)}
                >
                  <Heart
                    className={`size-5 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" disabled>
                  <MessageCircle className="size-5" />
                </Button>
              </div>

              <p className="text-sm font-semibold">{post.likes} likes</p>

              <p className="text-sm">
                <span className="font-semibold">{post.user.username}</span>{" "}
                {post.caption}
              </p>

              <p className="text-xs uppercase text-muted-foreground">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
