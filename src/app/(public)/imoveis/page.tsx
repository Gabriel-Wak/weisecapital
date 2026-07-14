import { PropertyCard } from "@/components/public/property-card";
import { FadeIn } from "@/components/animations/fade-in";
import { Skeleton } from "@/components/ui/skeleton";
import { propertyService } from "@/services/property.service";
import { siteConfig } from "@/config/site";
import { generateSEO } from "@/lib/seo";
import { propertySearchSchema } from "@/lib/validators";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Imóveis",
  description: "Encontre apartamentos, casas e imóveis comerciais para compra e locação.",
  url: `${siteConfig.url}/imoveis`,
});

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

async function PropertyList({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const parsed = propertySearchSchema.safeParse(searchParams);
  const params = parsed.success ? parsed.data : { page: 1, pageSize: 12 };

  const result = await propertyService.search(siteConfig.defaultTenantSlug, params);

  if (result.data.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">
          Nenhum imóvel encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {result.data.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </div>
      {result.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <a
                key={page}
                href={`/imoveis?page=${page}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  page === result.page
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                }`}
              >
                {page}
              </a>
            )
          )}
        </div>
      )}
    </>
  );
}

function PropertyListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
      ))}
    </div>
  );
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider text-primary uppercase">
              Catálogo
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Imóveis
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Explore nossa seleção de imóveis premium para compra e locação.
            </p>
          </div>
        </FadeIn>

        <Suspense fallback={<PropertyListSkeleton />}>
          <PropertyList searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}
