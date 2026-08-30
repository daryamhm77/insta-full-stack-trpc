"use client";

import type { Comment } from "@repo/trpc/schemas";
import { Trash2, User } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function Comments({
  comments,
  onAddComment,
  onDeleteComment,
}: CommentsProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-64 space-y-3 overflow-y-auto">
        {comments.map((comment) => {
          const avatarUrl = getImageUrl(comment.user.avatar);

          return (
            <div key={comment.id} className="flex items-start gap-2">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={comment.user.username}
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="size-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {comment.user.username}
                    </p>
                    <p className="text-sm wrap-break-word">{comment.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    onClick={() => onDeleteComment(comment.id)}
                  >
                    <Trash2 className="size-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit" variant="ghost" disabled={!commentText.trim()}>
          Post
        </Button>
      </form>
    </div>
  );
}
