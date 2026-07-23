import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PropertyCard } from "@/components/public/property-card";
import { PropertyActions } from "@/components/public/property-actions";
import { PropertyStickyCta } from "@/components/public/property-sticky-cta";
import { MortgageSimulator } from "@/components/public/mortgage-simulator";
import { GoogleMap } from "@/components/public/google-map";
import { VirtualTour } from "@/components/public/virtual-tour";
import { FadeIn } from "@/components/animations/fade-in";
import { propertyService } from "@/services/property.service";
import { siteConfig } from "@/config/site";
import {
  formatCurrency,
  formatArea,
  propertyTypeLabel,
  propertyPurposeLabel,
  propertyStatusLabel,
  getWhatsAppLink,
} from "@/lib/utils/format";
import { generateSEO, generatePropertyJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await propertyService.getBySlug(
    siteConfig.defaultTenantSlug,
    slug
  );

  if (!property) return {};

  return generateSEO({
    title: property.seoTitle ?? property.title,
    description: property.seoDescription ?? property.description ?? undefined,
    image: property.media[0]?.url,
    url: `${siteConfig.url}/imoveis/${slug}`,
    type: "article",
  });
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await propertyService.getBySlug(
    siteConfig.defaultTenantSlug,
    slug
  );

  if (!property) notFound();

  const related = await propertyService.getRelated(
    property.id,
    property.tenantId
  );

  const whatsappMessage = `Olá! Tenho interesse no imóvel ${property.code} - ${property.title}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePropertyJsonLd(property)),
        }}
      />

      <div className="pt-20 pb-24 md:pb-20">
        {/* Gallery */}
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-1.5 md:grid-cols-4 md:grid-rows-2">
            {property.media.slice(0, 5).map((media, i) => (
              <div
                key={media.id}
                className={`relative overflow-hidden ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className={`relative ${i === 0 ? "aspect-[16/10]" : "aspect-square"}`}>
                  <Image
                    src={media.url}
                    alt={media.alt ?? property.title}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes={i === 0 ? "66vw" : "33vw"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 px-5 lg:grid-cols-3 lg:gap-12 lg:px-8">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <FadeIn>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-sm">{propertyPurposeLabel(property.purpose)}</Badge>
                  <Badge variant="outline" className="rounded-sm">
                    {propertyTypeLabel(property.type)}
                  </Badge>
                  <Badge variant="secondary" className="rounded-sm">
                    {propertyStatusLabel(property.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Cód. {property.code}
                  </span>
                </div>
                <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  {property.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {property.neighborhood}, {property.city}
                  {property.state && ` - ${property.state}`}
                </div>
                <p className="mt-5 text-3xl font-semibold text-primary">
                  {formatCurrency(property.price)}
                  {property.rentPrice && (
                    <span className="ml-4 text-lg font-normal text-muted-foreground">
                      Locação: {formatCurrency(property.rentPrice)}/mês
                    </span>
                  )}
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="flex flex-wrap gap-6 rounded-xl border p-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Dormitórios</p>
                    </div>
                  </div>
                )}
                {property.suites > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.suites}</p>
                      <p className="text-xs text-muted-foreground">Suítes</p>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Banheiros</p>
                    </div>
                  </div>
                )}
                {property.parkingSpaces > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.parkingSpaces}</p>
                      <p className="text-xs text-muted-foreground">Vagas</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{formatArea(property.area)}</p>
                      <p className="text-xs text-muted-foreground">Área</p>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>

            {property.description && (
              <FadeIn>
                <div>
                  <h2 className="text-xl font-semibold">Descrição</h2>
                  <div
                    className="prose prose-neutral mt-4 max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>
              </FadeIn>
            )}

            {property.features.length > 0 && (
              <FadeIn>
                <div>
                  <h2 className="text-xl font-semibold">Características</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {property.features.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <span className="text-sm">{f.name}</span>
                        {f.value && (
                          <span className="text-sm font-medium">{f.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {(property.condoFee || property.iptu) && (
              <FadeIn>
                <div>
                  <h2 className="text-xl font-semibold">Valores</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {property.condoFee && (
                      <div className="flex justify-between rounded-lg border px-4 py-3">
                        <span>Condomínio</span>
                        <span className="font-medium">
                          {formatCurrency(property.condoFee)}/mês
                        </span>
                      </div>
                    )}
                    {property.iptu && (
                      <div className="flex justify-between rounded-lg border px-4 py-3">
                        <span>IPTU</span>
                        <span className="font-medium">
                          {formatCurrency(property.iptu)}/ano
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}

            {property.virtualTourUrl && (
              <FadeIn>
                <VirtualTour url={property.virtualTourUrl} />
              </FadeIn>
            )}

            <FadeIn>
              <div>
                <h2 className="text-xl font-semibold">Localização</h2>
                <div className="mt-4">
                  <GoogleMap
                    latitude={
                      property.latitude ? Number(property.latitude) : null
                    }
                    longitude={
                      property.longitude ? Number(property.longitude) : null
                    }
                    address={[property.address, property.neighborhood, property.city]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-28 border border-border/80 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold">
                Quer este imóvel?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Chame no WhatsApp para orçamento, disponibilidade ou visita.
              </p>

              {property.broker && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {property.broker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{property.broker.name}</p>
                    {property.broker.creci && (
                      <p className="text-xs text-muted-foreground">
                        CRECI {property.broker.creci}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-3">
                <Button
                  className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
                  asChild
                >
                  <a
                    href={getWhatsAppLink(
                      property.broker?.phone ?? siteConfig.whatsappPhone,
                      whatsappMessage
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Pedir orçamento no Zap
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contato">
                    <Phone className="mr-2 h-4 w-4" />
                    Agendar visita
                  </Link>
                </Button>
              </div>

              <div className="mt-4">
                <PropertyActions
                  propertyId={property.id}
                  title={property.title}
                  code={property.code}
                  whatsapp={property.broker?.phone ?? undefined}
                />
              </div>
            </Card>

            <MortgageSimulator defaultPrice={Number(property.price)} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-7xl px-5 pb-8 lg:px-8">
            <h2 className="font-heading mb-8 text-2xl font-semibold tracking-tight">
              Imóveis relacionados
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PropertyStickyCta
        code={property.code}
        title={property.title}
        brokerPhone={property.broker?.phone}
      />
    </>
  );
}
