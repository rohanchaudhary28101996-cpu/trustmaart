import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { AppImage } from "./AppImage";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function ListingImageGallery({
  images,
  title,
}: {
  images: { id: string; url: string; position: number }[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;
  const hasImages = total > 0;

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, goNext, goPrev]);

  if (!hasImages) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        <AppImage bucket="listing-images" path={null} alt={title} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-[16/10]">
        <AppImage
          bucket="listing-images"
          path={images[index].url}
          alt={`${title} — photo ${index + 1} of ${total}`}
          className="h-full w-full cursor-zoom-in"
        />

        {/* Click overlay for zoom */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label="Open fullscreen gallery"
        />

        {/* Counter badge */}
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {index + 1} / {total}
        </div>

        {/* Zoom hint */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          aria-label="Open fullscreen"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm hover:bg-background"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20",
                i === index
                  ? "border-primary ring-1 ring-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`Go to image ${i + 1}`}
            >
              <AppImage
                bucket="listing-images"
                path={img.url}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AppImage
              bucket="listing-images"
              path={images[index].url}
              alt={`${title} — fullscreen`}
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
            {total > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  onClick={goNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm text-white backdrop-blur-sm">
              {index + 1} / {total}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
