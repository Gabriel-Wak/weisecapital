import { HeroSection } from "@/components/public/hero-section";
import { PropertyCard } from "@/components/public/property-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { propertyService } from "@/services/property.service";
import { developmentRepository } from "@/repositories/development.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO, generateOrganizationJsonLd } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({});

async function getHomeData() {
  const tenantSlug = siteConfig.defaultTenantSlug;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return null;

  const [featured, launches, developments, testimonials, propertyCount] =
    await Promise.all([
      propertyService.getFeatured(tenantSlug),
      propertyService.getLaunches(tenantSlug),
      developmentRepository.getFeatured(tenant.id),
      prisma.testimonial.findMany({
        where: { tenantId: tenant.id, isActive: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.property.count({
        where: { tenantId: tenant.id, deletedAt: null, status: "AVAILABLE" },
      }),
    ]);

  return { featured, launches, developments, testimonials, propertyCount };
}

export default async function HomePage() {
  const data = await getHomeData();
  const whatsappHref = getWhatsAppLink(
    siteConfig.whatsappPhone,
    "Olá! Quero atendimento da Weise Capital para comprar ou alugar."
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationJsonLd()),
        }}
      />

      <HeroSection />

      {/* Proof strip — only real catalog count */}
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-sm text-muted-foreground">
            {data?.propertyCount ? (
              <>
                <span className="font-semibold text-foreground">
                  {data.propertyCount} imóveis
                </span>{" "}
                disponíveis no catálogo agora
              </>
            ) : (
              "Atendimento em venda e locação com foco em boa localização"
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/imoveis?purpose=SALE">Comprar</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/imoveis?purpose=RENT">Alugar</Link>
            </Button>
            <Button
              size="sm"
              className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              asChild
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                Falar no Zap
              </a>
            </Button>
          </div>
        </div>
      </section>

      {data?.featured && data.featured.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <FadeIn>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Seleção
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Imóveis em destaque
                  </h2>
                </div>
                <Button variant="ghost" asChild className="hidden shrink-0 md:flex">
                  <Link href="/imoveis">
                    Ver todos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.featured.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.launches && data.launches.length > 0 && (
        <section className="border-y bg-muted/40 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <FadeIn>
              <div className="mb-10">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  Lançamentos
                </p>
                <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                  Novidades no mercado
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.launches.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {data?.developments && data.developments.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <FadeIn>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Empreendimentos
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Projetos para investir ou morar
                  </h2>
                </div>
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link href="/empreendimentos">
                    Ver todos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-5 md:grid-cols-2">
              {data.developments.map((dev) => (
                <StaggerItem key={dev.id}>
                  <Link href={`/empreendimentos/${dev.slug}`}>
                    <div className="group border border-border/80 bg-card p-7 transition-colors hover:border-primary/30">
                      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        {dev.builder ?? "Empreendimento"}
                      </p>
                      <h3 className="font-heading mt-2 text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {dev.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {dev.neighborhood}, {dev.city}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {data?.testimonials && data.testimonials.length > 0 && (
        <section className="border-t bg-muted/30 py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <FadeIn>
              <h2 className="font-heading mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
                Quem já fechou conosco
              </h2>
            </FadeIn>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.testimonials.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.08}>
                  <Card className="h-full border-border/70 p-6 shadow-none">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-3.5 w-3.5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-5">
                      <p className="text-sm font-semibold">{t.name}</p>
                      {t.role && (
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      )}
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <FadeIn>
            <div className="bg-primary px-8 py-14 text-center text-primary-foreground md:px-16 md:py-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                Quer um orçamento ou visita?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/75 md:text-base">
                Chame no WhatsApp com o que você busca — bairro, orçamento e
                prazo. Respondemos com opções reais.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
                  asChild
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp agora
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contato">Agendar visita</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
