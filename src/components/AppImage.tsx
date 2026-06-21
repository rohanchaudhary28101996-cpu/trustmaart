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
  const [errored, setErrored] = useState(false);
  useEffect(() => {
    let active = true;
    setErrored(false);
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

  if (!path || errored) {
    return <img src={fallback} alt={alt} loading="lazy" className={cn("object-cover", className)} onClick={onClick} />;
  }
  if (!src) {
    return <div className={cn("animate-pulse bg-muted", className)} onClick={onClick} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("object-cover", className)}
      onClick={onClick}
      onError={() => setErrored(true)}
    />
  );
}
