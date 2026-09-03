"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Feed from "@/components/dashboard/feed";
import PhotoUpload from "@/components/dashboard/photo-upload";
import Sidebar from "@/components/dashboard/sidebar";
import { Stories } from "@/components/dashboard/stories";
import { Button } from "@/components/ui/button";
import { UserSearch } from "@/components/users/user-search";
import { trpc } from "@/lib/trpc/client";
import { uploadImage } from "@/lib/image";

export default function Home() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const postsQuery = trpc.posts.findAll.useQuery({});
  const storiesQuery = trpc.stories.getStories.useQuery();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.findAll.invalidate();
    },
  });
  const likePost = trpc.posts.likePost.useMutation({
    onMutate: ({ postId }) => {
      utils.posts.findAll.setData({}, (old) => {
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
  const savePost = trpc.posts.savePost.useMutation({
    onMutate: ({ postId }) => {
      utils.posts.findAll.setData({}, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isSaved: !post.isSaved,
            };
          }
          return post;
        });
      });
    },
    onSettled: async () => {
      await Promise.all([
        utils.posts.findAll.invalidate(),
        utils.posts.getSavedPosts.invalidate(),
      ]);
    },
  });
  const createComment = trpc.comments.create.useMutation({
    onSuccess: async (_, variables) => {
      await utils.comments.findByPostId.invalidate({
        postId: variables.postId,
      });

      utils.posts.findAll.setData({}, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === variables.postId) {
            return { ...post, comments: post.comments + 1 };
          }
          return post;
        });
      });
    },
  });
  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await utils.comments.findByPostId.invalidate();
      await utils.posts.findAll.invalidate();
    },
  });
  const createStory = trpc.stories.create.useMutation({
    onSuccess: async () => {
      await utils.stories.getStories.invalidate();
    },
  });

  const handleCreatePost = async (file: File, caption: string) => {
    const filename = await uploadImage(file);
    await createPost.mutateAsync({
      image: filename,
      caption,
    });
  };

  const handleStoryUpload = async (file: File) => {
    const filename = await uploadImage(file);
    await createStory.mutateAsync({
      image: filename,
    });
  };

  return (
    <main className="min-h-svh">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-14">
          <div className="ml-2 min-w-0 space-y-8 sm:ml-4 lg:ml-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Feed
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Latest posts from your community.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <UserSearch className="w-full sm:w-64" />
                <Button
                  type="button"
                  variant="outline"
                  className="new-post-button shrink-0"
                  onClick={() => setOpen(true)}
                >
                  <Plus aria-hidden="true" />
                  New post
                </Button>
              </div>
            </header>

            <Stories
              storyGroups={storiesQuery.data ?? []}
              onStoryUpload={handleStoryUpload}
            />

            <Feed
              posts={postsQuery.data ?? []}
              isLoading={postsQuery.isLoading}
              onLikePost={(postId) => likePost.mutate({ postId })}
              onSavePost={(postId) => savePost.mutate({ postId })}
              onAddComment={(postId, text) => {
                createComment.mutate({ postId, text });
              }}
              onDeleteComment={(commentId) => {
                deleteComment.mutate({ commentId });
              }}
            />
          </div>

          <aside className="w-full lg:sticky lg:top-8 lg:justify-self-end lg:h-fit">
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
