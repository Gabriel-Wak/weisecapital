"use client";

import { useCompareStore } from "@/stores/favorites.store";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/public/property-card";
import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

async function fetchProperties(ids: string[]) {
  const results = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) return null;
      return res.json();
    })
  );
  return results.filter(Boolean);
}

export default function CompararPage() {
  const { ids, clear, remove } = useCompareStore();

  const { data, isLoading } = useQuery({
    queryKey: ["compare", ids],
    queryFn: () => fetchProperties(ids),
    enabled: ids.length > 0,
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PageHeader
          title="Comparar Imóveis"
          description={`${ids.length}/3 imóveis selecionados`}
        >
          {ids.length > 0 && (
            <Button variant="outline" onClick={clear}>
              Limpar
            </Button>
          )}
        </PageHeader>

        {ids.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">
              Selecione até 3 imóveis para comparar.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/imoveis">Ver imóveis</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {ids.map((id) => (
              <Skeleton key={id} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {data?.map((property, i) => (
              <div key={property.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => remove(property.id)}
                >
                  Remover
                </Button>
                <PropertyCard property={property} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
