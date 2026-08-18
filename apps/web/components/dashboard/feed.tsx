"use client";

import type { Post } from "@repo/trpc/schemas";
import { Heart, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PostComments from "./post-comments";

interface FeedProps {
  posts: Post[];
  isLoading?: boolean;
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function Feed({
  posts,
  isLoading,
  onLikePost,
  onAddComment,
  onDeleteComment,
}: FeedProps) {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set(),
  );

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

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
        const commentsOpen = expandedComments.has(post.id);

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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle
                    className={`size-5 ${commentsOpen ? "fill-primary text-primary" : ""}`}
                  />
                </Button>
              </div>

              <p className="text-sm font-semibold">{post.likes} likes</p>

              <p className="text-sm">
                <span className="font-semibold">{post.user.username}</span>{" "}
                {post.caption}
              </p>

              {post.comments > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 text-sm text-muted-foreground hover:bg-transparent hover:opacity-80"
                  onClick={() => toggleComments(post.id)}
                >
                  View all {post.comments} comments
                </Button>
              )}

              <p className="text-xs uppercase text-muted-foreground">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>

              {commentsOpen && (
                <div className="border-t pt-4">
                  <PostComments
                    postId={post.id}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
