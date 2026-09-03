"use client";

import type { Post } from "@repo/trpc/schemas";
import { Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
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
      <div>
        {[0, 1].map((key) => (
          <div key={key} className="post-card overflow-hidden">
            <div className="h-12 animate-pulse bg-[var(--bg-card-soft)]" />
            <div className="aspect-square animate-pulse bg-[var(--bg-secondary)]" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--bg-card-soft)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--bg-card-soft)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="ice-card rounded-xl border border-dashed border-[var(--border-medium)] px-6 py-16 text-center">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          No posts yet
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Create your first post to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {posts.map((post) => {
        const avatarUrl = getImageUrl(post.user.avatar);
        const imageUrl = getImageUrl(post.image);
        const commentsOpen = expandedComments.has(post.id);

        return (
          <article key={post.id} className="post-card">
            <div className="flex items-center gap-3 px-4 py-3">
              <Link
                href={`/users/${post.user.id}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={post.user.username}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-[var(--bg-card-soft)]">
                    <User className="size-4 text-[var(--text-muted)]" />
                  </div>
                )}
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {post.user.username}
                </span>
              </Link>
            </div>

            <div className="relative aspect-square bg-[var(--bg-secondary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={post.caption}
                className="size-full object-cover"
              />
            </div>

            <div className="post-actions">
              <button
                type="button"
                className="post-action"
                onClick={() => onLikePost(post.id)}
                aria-label={post.isLiked ? "Unlike" : "Like"}
              >
                <Heart
                  className={`size-5 ${post.isLiked ? "fill-[var(--danger)] text-[var(--danger)]" : ""}`}
                />
              </button>
              <button
                type="button"
                className="post-action"
                onClick={() => toggleComments(post.id)}
                aria-label="Comments"
              >
                <MessageCircle
                  className={`size-5 ${commentsOpen ? "fill-[var(--ice-400)] text-[var(--ice-400)]" : ""}`}
                />
              </button>
            </div>

            <div className="space-y-2 px-4 pb-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {post.likes} {post.likes === 1 ? "like" : "likes"}
              </p>

              <p className="text-sm text-[var(--text-primary)]">
                <Link
                  href={`/users/${post.user.id}`}
                  className="font-semibold hover:opacity-80"
                >
                  {post.user.username}
                </Link>{" "}
                <span className="text-[var(--text-secondary)]">
                  {post.caption}
                </span>
              </p>

              {post.comments > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto p-0 text-sm text-[var(--text-muted)] hover:bg-transparent hover:text-[var(--ice-300)]"
                  onClick={() => toggleComments(post.id)}
                >
                  View all {post.comments} comments
                </Button>
              )}

              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>

              {commentsOpen && (
                <div className="border-t border-[var(--border-soft)] pt-4">
                  <PostComments
                    postId={post.id}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                  />
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
