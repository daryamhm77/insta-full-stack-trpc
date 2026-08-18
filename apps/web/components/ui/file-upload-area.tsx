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
      className={cn(
        "cursor-pointer rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className,
      )}
    >
      <Upload className="mx-auto mb-3 size-10 text-muted-foreground" />
      <p className="mb-1 text-sm font-medium">Drag a photo here</p>
      <p className="mb-4 text-xs text-muted-foreground">
        or click to select from your computer
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <ImageIcon className="size-4" />
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
