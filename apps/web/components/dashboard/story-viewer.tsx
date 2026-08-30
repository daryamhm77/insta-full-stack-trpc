"use client";

import type { StoryGroup } from "@repo/trpc/schemas";
import { ChevronLeft, ChevronRight, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StoryViewerProps {
  storyGroups: StoryGroup[];
  open: boolean;
  initialGroupIndex: number;
  onOpenChange: (open: boolean) => void;
}

export function StoryViewer({
  storyGroups,
  open,
  onOpenChange,
  initialGroupIndex,
}: StoryViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  const handleNext = () => {
    if (!currentGroup) return;

    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex((index) => index + 1);
      setProgress(0);
      return;
    }

    if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex((index) => index + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
      return;
    }

    onOpenChange(false);
  };

  const handlePrevious = () => {
    if (!currentGroup) return;

    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((index) => index - 1);
      setProgress(0);
      return;
    }

    if (currentGroupIndex > 0) {
      const previousGroup = storyGroups[currentGroupIndex - 1];
      setCurrentGroupIndex((index) => index - 1);
      setCurrentStoryIndex(Math.max((previousGroup?.stories.length ?? 1) - 1, 0));
      setProgress(0);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentGroupIndex(initialGroupIndex);
      setCurrentStoryIndex(0);
      setProgress(0);
    }
  }, [open, initialGroupIndex]);

  useEffect(() => {
    if (!open || !currentStory) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- advance when the active story changes
  }, [currentStory?.id, open]);

  if (!open || !currentGroup || !currentStory) {
    return null;
  }

  const avatarUrl = getImageUrl(currentGroup.avatar);
  const imageUrl = getImageUrl(currentStory.image);
  const canGoPrevious = currentGroupIndex > 0 || currentStoryIndex > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[90vh] w-full max-w-md overflow-hidden bg-black p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute top-0 right-0 left-0 z-20 flex gap-1 p-2">
            {currentGroup.stories.map((_, index) => (
              <div
                key={index}
                className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      index < currentStoryIndex
                        ? "100%"
                        : index === currentStoryIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-4 right-0 left-0 z-20 flex items-center justify-between px-4 pt-2">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={currentGroup.username}
                  className="size-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-white/20">
                  <User className="size-4 text-white" />
                </div>
              )}
              <span className="text-sm font-semibold text-white">
                {currentGroup.username}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Story"
              className="size-full object-contain"
            />
          </div>

          {canGoPrevious && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="size-6" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
