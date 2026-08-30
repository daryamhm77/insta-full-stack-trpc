"use client";

import type { StoryGroup } from "@repo/trpc/schemas";
import { Plus, User } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StoryUpload from "./story-upload";
import { StoryViewer } from "./story-viewer";

interface StoriesProps {
  storyGroups: StoryGroup[];
  onStoryUpload: (file: File) => Promise<void>;
}

export function Stories({ storyGroups, onStoryUpload }: StoriesProps) {
  const { data: session } = authClient.useSession();
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const ownStoryGroup = storyGroups.find(
    (group) => group.userId === session?.user.id,
  );
  const otherStoryGroups = storyGroups.filter(
    (group) => group.userId !== session?.user.id,
  );
  const orderedStoryGroups = [
    ...(ownStoryGroup ? [ownStoryGroup] : []),
    ...otherStoryGroups,
  ];

  const sessionAvatarUrl = getImageUrl(session?.user.image ?? "");

  return (
    <Card className="ice-card mb-6 gap-0 p-4 pl-5 ring-0">
      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-1">
        <div className="story-item">
          <div className="relative">
            <button
              type="button"
              className={
                ownStoryGroup ? "story-ring" : "story-ring story-ring-muted"
              }
              onClick={() => {
                if (ownStoryGroup) {
                  setSelectedGroupIndex(0);
                  setShowStoryViewer(true);
                }
              }}
            >
              {sessionAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sessionAvatarUrl}
                  alt="Your profile picture"
                  className="size-16 rounded-full border-2 border-[var(--bg-primary)] object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-[var(--bg-primary)] bg-[var(--bg-card-soft)]">
                  <User className="size-6 text-[var(--text-muted)]" />
                </div>
              )}
            </button>
            <Button
              type="button"
              onClick={() => setShowCreateStory(true)}
              size="icon-sm"
              variant="ghost"
              className="absolute right-0 bottom-0 size-5 rounded-full border-2 border-[var(--bg-primary)]"
            >
              <Plus aria-hidden="true" className="size-3" />
            </Button>
          </div>
          <span
            className="w-16 truncate text-center text-xs text-[var(--text-secondary)]"
            title="Your story"
          >
            Your story
          </span>
        </div>

        {otherStoryGroups.map((storyGroup, index) => {
          const avatarUrl = getImageUrl(storyGroup.avatar);

          return (
            <button
              key={storyGroup.userId}
              type="button"
              className="story-item"
              onClick={() => {
                setSelectedGroupIndex(ownStoryGroup ? index + 1 : index);
                setShowStoryViewer(true);
              }}
            >
              <div className="story-ring">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={storyGroup.username}
                    className="size-16 rounded-full border-2 border-[var(--bg-primary)] object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-[var(--bg-primary)] bg-[var(--bg-card-soft)]">
                    <User className="size-6 text-[var(--text-muted)]" />
                  </div>
                )}
              </div>
              <span
                className="w-16 truncate text-center text-xs text-[var(--text-secondary)]"
                title={storyGroup.username}
              >
                {storyGroup.username}
              </span>
            </button>
          );
        })}
      </div>

      <StoryUpload
        open={showCreateStory}
        onOpenChange={setShowCreateStory}
        onSubmit={onStoryUpload}
      />

      <StoryViewer
        storyGroups={orderedStoryGroups}
        initialGroupIndex={selectedGroupIndex}
        open={showStoryViewer}
        onOpenChange={setShowStoryViewer}
      />
    </Card>
  );
}
