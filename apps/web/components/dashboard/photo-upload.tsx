"use client";

import { useCallback, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
      <DialogContent
        className="create-post-modal gap-5 p-5 sm:max-w-[520px]"
        showCloseButton={!isUploading}
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">
            Create new post
          </DialogTitle>
          <DialogDescription className="text-[var(--text-muted)]">
            Add a photo and a short caption to share.
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div
            role="button"
            tabIndex={0}
            data-dragging={isDragging}
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
            className="upload-zone cursor-pointer"
          >
            <Upload className="mb-1 size-10 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Drag a photo here
            </p>
            <p className="mb-2 text-xs text-[var(--text-muted)]">
              JPG, PNG, GIF, or WebP · up to {MAX_SIZE_MB}MB
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <ImageIcon aria-hidden="true" />
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
            <div className="image-preview bg-[var(--bg-secondary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Selected preview" />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2"
                onClick={reset}
                disabled={isUploading}
                aria-label="Remove photo"
              >
                <X aria-hidden="true" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption" className="text-[var(--text-secondary)]">
                Caption
              </Label>
              <textarea
                id="caption"
                rows={3}
                value={caption}
                disabled={isUploading}
                placeholder="Write a caption..."
                onChange={(event) => setCaption(event.target.value)}
                className="caption-input text-sm disabled:opacity-50"
              />
            </div>

            <div className="modal-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleUpload}
                disabled={isUploading || !caption.trim()}
              >
                {isUploading ? "Sharing..." : "Share"}
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <p className="text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
