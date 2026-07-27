import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { HeroSection } from "@/components/public/hero-section";
import { PropertyCard } from "@/components/public/property-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { propertyService } from "@/services/property.service";
import { developmentRepository } from "@/repositories/development.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO, generateOrganizationJsonLd } from "@/lib/seo";
import { formatCurrency, getWhatsAppLink } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({});

async function getHomeData() {
  const tenantSlug = siteConfig.defaultTenantSlug;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return null;

  const [available, launches, developments, testimonials, propertyCount, banners] =
    await Promise.all([
      propertyService.getAvailable(tenantSlug, 6),
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
      prisma.banner.findMany({
        where: {
          tenantId: tenant.id,
          deletedAt: null,
          isActive: true,
          position: "HOME_HERO",
        },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          subtitle: true,
          imageDesktop: true,
          imageTablet: true,
          imageMobile: true,
          ctaText: true,
          ctaLink: true,
        },
      }),
    ]);

  return { available, launches, developments, testimonials, propertyCount, banners };
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

      <HeroSection banners={data?.banners ?? []} />

      {data?.available && data.available.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <FadeIn>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                    Catálogo
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Imóveis disponíveis
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {data.propertyCount
                      ? `${data.propertyCount} opções no catálogo`
                      : "Seleção atual para compra e locação"}
                  </p>
                </div>
                <Button asChild className="shrink-0">
                  <Link href="/imoveis">
                    Ver mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.available.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
            <div className="mt-8 flex justify-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/imoveis">
                  Ver mais imóveis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="border-y bg-card">
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

      {data?.launches && data.launches.length > 0 && (
        <section className="bg-muted/40 py-20 md:py-24">
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
                    Ver mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-6 md:grid-cols-2">
              {data.developments.map((dev) => {
                const image = dev.media?.[0];
                return (
                  <StaggerItem key={dev.id}>
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
                        <div className="p-6">
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
                      </article>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
            <div className="mt-8 flex justify-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/empreendimentos">
                  Ver mais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
