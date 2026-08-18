const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Resolve stored image paths/filenames to a full URL served by the API. */
export function getImageUrl(image: string) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${API_URL}${image}`;
  return `${API_URL}/uploads/images/${image}`;
}
