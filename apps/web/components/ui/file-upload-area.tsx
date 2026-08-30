"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export default function FileUploadArea({
  onFileSelect,
  accept = "image/*",
  className,
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      data-dragging={isDragging}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn("upload-zone cursor-pointer", className)}
    >
      <Upload className="size-10 text-[var(--text-muted)]" />
      <p className="text-sm font-medium text-[var(--text-primary)]">
        Drag a photo here
      </p>
      <p className="mb-1 text-xs text-[var(--text-muted)]">
        or click to select from your computer
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <ImageIcon aria-hidden="true" />
        Choose file
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="sr-only"
      />
    </div>
  );
}
