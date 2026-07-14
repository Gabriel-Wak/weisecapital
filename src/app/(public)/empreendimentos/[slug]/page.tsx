import { notFound } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { PropertyCard } from "@/components/public/property-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { developmentRepository } from "@/repositories/development.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils/format";
import { toPropertyCardDataList } from "@/lib/utils/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });
  if (!tenant) return {};
  const dev = await developmentRepository.findBySlug(tenant.id, slug);
  if (!dev) return {};
  return generateSEO({
    title: dev.name,
    description: dev.description ?? undefined,
    url: `${siteConfig.url}/empreendimentos/${slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function EmpreendimentoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });
  if (!tenant) notFound();

  const development = await developmentRepository.findBySlug(tenant.id, slug);
  if (!development) notFound();

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <Badge variant="secondary" className="mb-4">
            {development.status}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {development.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {development.neighborhood}, {development.city}
            {development.builder && ` · ${development.builder}`}
          </p>
          {development.minPrice && (
            <p className="mt-4 text-2xl font-bold text-primary">
              A partir de {formatCurrency(development.minPrice)}
            </p>
          )}
        </FadeIn>

        {development.description && (
          <FadeIn delay={0.2} className="mt-12">
            <div
              className="prose prose-lg max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: development.description }}
            />
          </FadeIn>
        )}

        {development.properties.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">Unidades disponíveis</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {toPropertyCardDataList(development.properties).map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Button asChild>
            <Link href="/contato">Solicitar informações</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
