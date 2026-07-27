import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";
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
            <h1 className="font-heading mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Projetos para investir ou morar
            </h1>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2">
          {result.data.map((dev, i) => {
            const image = dev.media?.[0];
            return (
              <FadeIn key={dev.id} delay={i * 0.08}>
                <Link href={`/empreendimentos/${dev.slug}`} className="group block">
                  <article className="overflow-hidden border border-border/80 bg-card transition-shadow hover:shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? dev.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            Sem imagem
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {dev.minPrice && (
                        <p className="absolute right-4 bottom-4 text-sm font-semibold text-white">
                          A partir de {formatCurrency(dev.minPrice)}
                        </p>
                      )}
                    </div>
                    <div className="p-6 md:p-7">
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        {dev.builder ?? "Empreendimento"} · {dev.status}
                      </p>
                      <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {dev.name}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {dev.neighborhood}, {dev.city}
                      </p>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
