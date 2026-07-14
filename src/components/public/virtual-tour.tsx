"use client";

interface VirtualTourProps {
  url?: string | null;
}

export function VirtualTour({ url }: VirtualTourProps) {
  if (!url) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tour Virtual 360°</h2>
      <div className="aspect-video overflow-hidden rounded-xl border">
        <iframe
          src={url}
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          title="Tour virtual 360°"
        />
      </div>
    </div>
  );
}
