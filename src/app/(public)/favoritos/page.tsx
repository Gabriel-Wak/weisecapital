"use client";

import { useFavoritesStore } from "@/stores/favorites.store";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/public/property-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchProperty(id: string) {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default function FavoritosPage() {
  const { ids } = useFavoritesStore();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map(fetchProperty));
      return results.filter(Boolean);
    },
    enabled: ids.length > 0,
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight">Favoritos</h1>
        <p className="mt-2 text-muted-foreground">
          {ids.length} imóvel(is) salvos
        </p>

        {ids.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Nenhum favorito ainda.</p>
            <Button className="mt-4" asChild>
              <Link href="/imoveis">Explorar imóveis</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ids.map((id) => (
              <Skeleton key={id} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
