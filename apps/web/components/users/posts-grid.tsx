"use client";

import type { Post } from "@repo/trpc/schemas";
import { Heart, MessageCircle } from "lucide-react";
import { getImageUrl } from "@/lib/image";

interface PostsGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export function PostsGrid({ posts, onPostClick }: PostsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <button
          key={post.id}
          type="button"
          onClick={() => onPostClick(post)}
          className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(post.image)}
            alt={post.caption}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Heart className="size-5" />
              <span className="font-semibold">{post.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              <span className="font-semibold">{post.comments}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
