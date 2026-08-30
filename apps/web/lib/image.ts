const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Resolve stored image paths/filenames to a full URL served by the API. */
export function getImageUrl(image: string) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${API_URL}${image}`;
  return `${API_URL}/uploads/images/${image}`;
}

/** Upload an image via the Next.js rewrite → Nest `/api/upload/image`. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const uploadResponse = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text().catch(() => "");
    throw new Error(message || "Failed to upload image");
  }

  const { filename } = (await uploadResponse.json()) as {
    filename: string;
    url: string;
  };

  return filename;
}
