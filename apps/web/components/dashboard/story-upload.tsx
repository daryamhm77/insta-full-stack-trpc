"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileUploadArea from "@/components/ui/file-upload-area";

interface StoryUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
}

export default function StoryUpload({
  open,
  onOpenChange,
  onSubmit,
}: StoryUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onSubmit(selectedFile);
      clearSelection();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating story", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) clearSelection();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="create-post-modal gap-5 p-5 sm:max-w-[520px]"
        showCloseButton={!isUploading}
      >
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">
            Add to your story
          </DialogTitle>
        </DialogHeader>

        {!preview ? (
          <FileUploadArea onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-4">
            <div className="relative image-preview bg-[var(--bg-secondary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-96" />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2"
                onClick={clearSelection}
                aria-label="Remove photo"
              >
                <X aria-hidden="true" />
              </Button>
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
                {isUploading ? "Sharing..." : "Share to Story"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
