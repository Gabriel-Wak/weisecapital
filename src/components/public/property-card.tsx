"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatArea,
  propertyTypeLabel,
  propertyPurposeLabel,
} from "@/lib/utils/format";
import type { PropertyCardData } from "@/lib/utils/serialize";

interface PropertyCardProps {
  property: PropertyCardData;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const image = property.media?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -60px 0px" }}
      transition={{
        delay: Math.min(index * 0.06, 0.24),
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/imoveis/${property.slug}`} className="group block">
        <article className="overflow-hidden border border-border/70 bg-card transition-shadow duration-300 hover:shadow-md">
          <div className="relative aspect-[4/3] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt ?? property.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-sm text-muted-foreground">Sem imagem</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge className="rounded-sm border-0 bg-white/95 text-foreground shadow-none">
                {propertyPurposeLabel(property.purpose)}
              </Badge>
              {property.isFeatured && (
                <Badge className="rounded-sm border-0 bg-primary text-primary-foreground shadow-none">
                  Destaque
                </Badge>
              )}
            </div>
            <p className="absolute right-3 bottom-3 text-sm font-semibold text-white">
              {formatCurrency(property.price)}
            </p>
          </div>

          <div className="space-y-3 p-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {propertyTypeLabel(property.type)} · {property.code}
              </p>
              <h3 className="font-heading mt-1.5 line-clamp-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {property.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {property.neighborhood}, {property.city}
              </span>
            </div>

            <div className="flex items-center gap-4 border-t border-border/60 pt-3 text-sm text-muted-foreground">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.bathrooms}
                </span>
              )}
              {property.parkingSpaces > 0 && (
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  {property.parkingSpaces}
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  {formatArea(property.area)}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
