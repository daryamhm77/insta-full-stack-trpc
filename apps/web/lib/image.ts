const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Resolve stored image paths, filenames, or absolute S3 URLs. */
export function getImageUrl(image: string) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return `${API_URL}${image}`;
  return `${API_URL}/uploads/images/${image}`;
}

/** Upload an image to the API. Returns an S3 URL in production, or a filename locally. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const uploadResponse = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text().catch(() => "");
    throw new Error(message || "Failed to upload image");
  }

  const { filename, url } = (await uploadResponse.json()) as {
    filename: string;
    url: string;
  };

  if (url?.startsWith("http://") || url?.startsWith("https://")) {
    return url;
  }

  return filename;
}
