"use client";

import { Heart, GitCompare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore, useCompareStore } from "@/stores/favorites.store";
import { getWhatsAppLink } from "@/lib/utils/format";
import { toast } from "sonner";

interface PropertyActionsProps {
  propertyId: string;
  title: string;
  code: string;
  whatsapp?: string;
}

export function PropertyActions({
  propertyId,
  title,
  code,
  whatsapp,
}: PropertyActionsProps) {
  const { toggle, isFavorite } = useFavoritesStore();
  const { add, isInCompare, ids } = useCompareStore();

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={isFavorite(propertyId) ? "default" : "outline"}
        size="sm"
        onClick={() => {
          toggle(propertyId);
          toast.success(
            isFavorite(propertyId) ? "Removido dos favoritos" : "Adicionado aos favoritos"
          );
        }}
      >
        <Heart className={`mr-2 h-4 w-4 ${isFavorite(propertyId) ? "fill-current" : ""}`} />
        Favoritar
      </Button>
      <Button
        variant={isInCompare(propertyId) ? "default" : "outline"}
        size="sm"
        disabled={!isInCompare(propertyId) && ids.length >= 3}
        onClick={() => {
          add(propertyId);
          toast.success("Adicionado à comparação");
        }}
      >
        <GitCompare className="mr-2 h-4 w-4" />
        Comparar
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Compartilhar
      </Button>
      {whatsapp && (
        <Button variant="outline" size="sm" asChild>
          <a
            href={getWhatsAppLink(whatsapp, `Olá! Tenho interesse no imóvel ${code} - ${title}`)}
            target="_blank"
            rel="noopener"
          >
            WhatsApp
          </a>
        </Button>
      )}
    </div>
  );
}
