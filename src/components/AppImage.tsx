import { useEffect, useState } from "react";
import { signedUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Bucket = "listing-images" | "chat-images" | "avatars";

export function AppImage({
  bucket,
  path,
  alt,
  className,
  fallback = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=60",
  onClick,
}: {
  bucket: Bucket;
  path?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  onClick?: () => void;
}) {
  const [src, setSrc] = useState<string>("");
  useEffect(() => {
    let active = true;
    if (!path) {
      setSrc("");
      return;
    }
    signedUrl(bucket, path).then((u) => {
      if (active) setSrc(u);
    });
    return () => {
      active = false;
    };
  }, [bucket, path]);
  return (
    <img
      src={src || fallback}
      alt={alt}
      loading="lazy"
      className={cn("object-cover", className)}
      onClick={onClick}
      onError={(e) => ((e.currentTarget as HTMLImageElement).src = fallback)}
    />
  );
}
