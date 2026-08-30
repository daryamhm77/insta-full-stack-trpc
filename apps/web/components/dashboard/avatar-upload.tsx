"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FileUploadArea from "@/components/ui/file-upload-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/image";

interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
  currentAvatar?: string | null;
}

export default function AvatarUpload({
  open,
  onOpenChange,
  onSubmit,
  currentAvatar,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) clearSelection();
    onOpenChange(nextOpen);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setError(null);

    try {
      await onSubmit(selectedFile);
      clearSelection();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  const currentAvatarUrl = currentAvatar ? getImageUrl(currentAvatar) : "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="create-post-modal gap-5 p-5 sm:max-w-[520px]"
        showCloseButton={!isUploading}
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">
            Update profile picture
          </DialogTitle>
          <DialogDescription className="text-[var(--text-muted)]">
            Choose a new photo for your avatar.
          </DialogDescription>
        </DialogHeader>

        {!preview ? (
          <div className="space-y-4">
            {currentAvatarUrl ? (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentAvatarUrl}
                  alt="Current avatar"
                  className="size-24 rounded-full border border-[var(--border-soft)] object-cover"
                />
              </div>
            ) : null}
            <FileUploadArea onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="size-32 rounded-full border-2 border-[var(--ice-400)] object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute -top-1 -right-1 rounded-full"
                  onClick={clearSelection}
                  disabled={isUploading}
                  aria-label="Remove selection"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Updating..." : "Update avatar"}
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
