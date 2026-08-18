"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Feed from "@/components/dashboard/feed";
import PhotoUpload from "@/components/dashboard/photo-upload";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function Home() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const postsQuery = trpc.posts.findAll.useQuery();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.findAll.invalidate();
    },
  });
  const likePost = trpc.posts.likePost.useMutation({
    onMutate: ({ postId }) => {
      utils.posts.findAll.setData(undefined, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        });
      });
    },
    onSettled: async () => {
      await utils.posts.findAll.invalidate();
    },
  });

  const handleCreatePost = async (file: File, caption: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    const { filename } = (await uploadResponse.json()) as {
      filename: string;
      url: string;
    };

    await createPost.mutateAsync({
      image: filename,
      caption,
    });
  };

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <header className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
                <p className="text-sm text-muted-foreground">
                  Latest posts from your community.
                </p>
              </div>
              <Button type="button" onClick={() => setOpen(true)}>
                <Plus className="size-4" />
                New post
              </Button>
            </header>

            <Feed
              posts={postsQuery.data ?? []}
              isLoading={postsQuery.isLoading}
              onLikePost={(postId) => likePost.mutate({ postId })}
            />
          </div>

          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <Sidebar />
          </aside>
        </div>
      </div>

      <PhotoUpload
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreatePost}
      />
    </main>
  );
}
