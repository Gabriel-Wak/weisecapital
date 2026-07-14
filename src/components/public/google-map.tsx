"use client";

interface GoogleMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
}

export function GoogleMap({ latitude, longitude, address }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!latitude || !longitude) {
    if (!address) return null;
    const q = encodeURIComponent(address);
    const src = apiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${q}`
      : `https://maps.google.com/maps?q=${q}&output=embed`;
    return (
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa"
        />
      </div>
    );
  }

  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=15`
    : `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;

  return (
    <div className="aspect-video overflow-hidden rounded-xl">
      <iframe
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa"
      />
    </div>
  );
}
