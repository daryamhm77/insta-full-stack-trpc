"use client";

import type { Post } from "@repo/trpc/schemas";
import { Bookmark, Heart, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { getImageUrl } from "@/lib/image";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostModal({
  post: initialPost,
  open,
  onOpenChange,
}: PostModalProps) {
  const { data: allPosts } = trpc.posts.findAll.useQuery({});
  const post = allPosts?.find((item) => item.id === initialPost.id) || initialPost;
  const [commentText, setCommentText] = useState("");
  const [isSaved, setIsSaved] = useState(Boolean(initialPost.isSaved));

  useEffect(() => {
    setIsSaved(Boolean(post.isSaved ?? initialPost.isSaved));
  }, [post.id, post.isSaved, initialPost.isSaved]);

  const { data: comments = [] } = trpc.comments.findByPostId.useQuery({
    postId: post.id,
  });
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session } = authClient.useSession();

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await utils.comments.findByPostId.invalidate({ postId: post.id });
      await utils.posts.findAll.invalidate();
    },
  });

  const likePostMutation = trpc.posts.likePost.useMutation({
    onSuccess: async () => {
      await utils.posts.findAll.invalidate();
      await utils.users.getUserProfile.invalidate();
    },
  });

  const createCommentMutation = trpc.comments.create.useMutation({
    onSuccess: async (_, variables) => {
      await utils.comments.findByPostId.invalidate({
        postId: variables.postId,
      });
      await utils.posts.findAll.invalidate();
      setCommentText("");
    },
  });

  const savePostMutation = trpc.posts.savePost.useMutation({
    onMutate: () => {
      setIsSaved((prev) => !prev);
    },
    onError: () => {
      setIsSaved((prev) => !prev);
    },
    onSuccess: async () => {
      await utils.posts.findAll.invalidate();
      await utils.posts.getSavedPosts.invalidate();
    },
  });

  const handleDeleteComment = async (commentId: number) => {
    await deleteCommentMutation.mutateAsync({ commentId });
  };

  const handleSave = async () => {
    await savePostMutation.mutateAsync({ postId: post.id });
  };

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (commentText.trim()) {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        text: commentText,
      });
    }
  };

  const handleLike = async () => {
    await likePostMutation.mutateAsync({ postId: post.id });
  };

  const avatarUrl = getImageUrl(post.user.avatar);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden p-0 sm:max-w-5xl"
        showCloseButton={false}
      >
        <div className="grid h-full flex-1 overflow-hidden md:grid-cols-[1.5fr_1fr]">
          <div className="relative flex min-h-0 items-center justify-center bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(post.image)}
              alt={post.caption}
              className="size-full object-contain"
            />
          </div>

          <div className="flex h-full flex-col bg-background">
            <div className="flex items-center justify-between border-b p-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/users/${post.user.id}`)}
                className="flex h-auto items-center gap-3 p-0"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={post.user.username}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
                <span className="font-semibold">{post.user.username}</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex gap-3">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={post.user.username}
                    className="size-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div>
                    <button
                      type="button"
                      onClick={() => router.push(`/users/${post.user.id}`)}
                      className="mr-2 font-semibold hover:opacity-80"
                    >
                      {post.user.username}
                    </button>
                    <span className="text-sm">{post.caption}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {comments.map((comment) => {
                  const commentAvatar = getImageUrl(comment.user.avatar);

                  return (
                    <div key={comment.id} className="flex items-start gap-2">
                      {commentAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={commentAvatar}
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
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/users/${comment.user.id}`)
                              }
                              className="text-sm font-semibold hover:opacity-80"
                            >
                              {comment.user.username}
                            </button>
                            <p className="text-sm wrap-break-word">
                              {comment.text}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {session?.user.id === comment.user.id && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="shrink-0"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="size-3 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>

            <div className="border-t p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleLike}
                    disabled={likePostMutation.isPending}
                    className="h-auto p-0"
                  >
                    <Heart
                      className={`size-6 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <div className="text-sm font-semibold">{post.likes} likes</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  disabled={savePostMutation.isPending}
                  className="h-auto p-0"
                >
                  <Bookmark
                    className={`size-6 ${isSaved ? "fill-foreground" : ""}`}
                  />
                </Button>
              </div>

              <form
                onSubmit={handleAddComment}
                className="flex items-center gap-2 border-t pt-4"
              >
                <Input
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  disabled={!commentText.trim()}
                >
                  Post
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
