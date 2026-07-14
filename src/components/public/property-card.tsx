"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/imoveis/${property.slug}`}>
        <Card className="group overflow-hidden border-0 bg-card shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-[4/3] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt ?? property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">Sem imagem</span>
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {propertyPurposeLabel(property.purpose)}
              </Badge>
              {property.isFeatured && (
                <Badge className="bg-primary/90 backdrop-blur-sm">Destaque</Badge>
              )}
              {property.isLaunch && (
                <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                  Lançamento
                </Badge>
              )}
            </div>
            <div className="absolute right-3 bottom-3 rounded-lg bg-background/90 px-3 py-1.5 text-sm font-bold backdrop-blur-sm">
              {formatCurrency(property.price)}
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div>
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {propertyTypeLabel(property.type)} · {property.code}
              </p>
              <h3 className="mt-1 line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {property.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {property.neighborhood}, {property.city}
              </span>
            </div>

            <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
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
        </Card>
      </Link>
    </motion.div>
  );
}
