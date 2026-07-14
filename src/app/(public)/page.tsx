import { HeroSection } from "@/components/public/hero-section";
import { PropertyCard } from "@/components/public/property-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Star, Building2, Users, Award } from "lucide-react";
import { propertyService } from "@/services/property.service";
import { developmentRepository } from "@/repositories/development.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO, generateOrganizationJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({});

async function getHomeData() {
  const tenantSlug = siteConfig.defaultTenantSlug;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return null;

  const [featured, launches, developments, testimonials, partners] =
    await Promise.all([
      propertyService.getFeatured(tenantSlug),
      propertyService.getLaunches(tenantSlug),
      developmentRepository.getFeatured(tenant.id),
      prisma.testimonial.findMany({
        where: { tenantId: tenant.id, isActive: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
      prisma.partner.findMany({
        where: { tenantId: tenant.id, isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

  return { featured, launches, developments, testimonials, partners };
}

export default async function HomePage() {
  const data = await getHomeData();

  const stats = [
    { label: "Imóveis", value: 500, suffix: "+", icon: Building2 },
    { label: "Clientes", value: 1200, suffix: "+", icon: Users },
    { label: "Anos", value: 15, suffix: "+", icon: Award },
    { label: "Avaliação", value: 4.9, suffix: "", icon: Star },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationJsonLd()),
        }}
      />

      <HeroSection />

      {/* Stats */}
      <section className="border-y bg-muted/30 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold tracking-tight md:text-4xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      {data?.featured && data.featured.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium tracking-wider text-primary uppercase">
                    Destaques
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                    Imóveis em Destaque
                  </h2>
                </div>
                <Button variant="ghost" asChild className="hidden md:flex">
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

      {/* Launches */}
      {data?.launches && data.launches.length > 0 && (
        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12 text-center">
                <p className="text-sm font-medium tracking-wider text-primary uppercase">
                  Lançamentos
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  Novos Lançamentos
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

      {/* Developments */}
      {data?.developments && data.developments.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium tracking-wider text-primary uppercase">
                    Empreendimentos
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                    Projetos Exclusivos
                  </h2>
                </div>
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link href="/empreendimentos">
                    Ver todos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-6 md:grid-cols-2">
              {data.developments.map((dev) => (
                <StaggerItem key={dev.id}>
                  <Link href={`/empreendimentos/${dev.slug}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm transition-all hover:shadow-xl">
                      <div className="p-8">
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                          {dev.builder ?? "Empreendimento"}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                          {dev.name}
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                          {dev.neighborhood}, {dev.city}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {data?.testimonials && data.testimonials.length > 0 && (
        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  O que nossos clientes dizem
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.testimonials.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.1}>
                  <Card className="border-0 p-6 shadow-sm">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                    <div className="mt-4">
                      <p className="font-semibold">{t.name}</p>
                      {t.role && (
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      )}
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn>
            <Card className="relative overflow-hidden border-0 bg-primary p-12 text-center text-primary-foreground md:p-16">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Pronto para encontrar seu imóvel?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                  Nossa equipe de especialistas está pronta para ajudá-lo a
                  encontrar o imóvel perfeito.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/contato">Fale Conosco</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link href="/imoveis">Ver Imóveis</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
