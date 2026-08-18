"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_MB = 5;

interface PhotoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File, caption: string) => Promise<void>;
}

function isValidImage(file: File) {
  return (
    ACCEPTED_TYPES.includes(file.type) &&
    file.size <= MAX_SIZE_MB * 1024 * 1024
  );
}

export default function PhotoUpload({
  open,
  onOpenChange,
  onSubmit,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const reset = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setCaption("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const selectFile = useCallback((file: File) => {
    if (!isValidImage(file)) {
      setError(`Use a JPG, PNG, GIF, or WebP under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) selectFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim() || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      await onSubmit(selectedFile, caption.trim());
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isUploading}>
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
          <DialogDescription>
            Add a photo and a short caption to share.
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
          >
            <Upload className="mb-3 size-10 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium">Drag a photo here</p>
            <p className="mb-4 text-xs text-muted-foreground">
              JPG, PNG, GIF, or WebP · up to {MAX_SIZE_MB}MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <ImageIcon className="size-4" />
              Choose file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) selectFile(file);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected preview"
                className="h-64 w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-2 right-2"
                onClick={reset}
                disabled={isUploading}
              >
                <X className="size-4" />
                <span className="sr-only">Remove photo</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <textarea
                id="caption"
                rows={3}
                value={caption}
                disabled={isUploading}
                placeholder="Write a caption..."
                onChange={(event) => setCaption(event.target.value)}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || !caption.trim()}
              >
                {isUploading ? "Sharing..." : "Share"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
