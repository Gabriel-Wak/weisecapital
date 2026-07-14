import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
import { developmentRepository } from "@/repositories/development.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Empreendimentos",
  description: "Conheça nossos empreendimentos e lançamentos exclusivos.",
  url: `${siteConfig.url}/empreendimentos`,
});

export default async function EmpreendimentosPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const result = await developmentRepository.findMany(tenant.id, {
    page: 1,
    pageSize: 20,
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider text-primary uppercase">
              Empreendimentos
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Projetos Exclusivos
            </h1>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {result.data.map((dev, i) => (
            <FadeIn key={dev.id} delay={i * 0.1}>
              <Link href={`/empreendimentos/${dev.slug}`}>
                <Card className="group overflow-hidden border-0 p-8 shadow-sm transition-all hover:shadow-xl">
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {dev.builder ?? "Empreendimento"} · {dev.status}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                    {dev.name}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {dev.neighborhood}, {dev.city}
                  </p>
                  {dev.minPrice && (
                    <p className="mt-4 font-semibold text-primary">
                      A partir de {formatCurrency(dev.minPrice)}
                    </p>
                  )}
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
