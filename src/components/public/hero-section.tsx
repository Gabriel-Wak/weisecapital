"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearch } from "./property-search";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export type HeroBannerData = {
  id: string;
  title: string;
  subtitle: string | null;
  imageDesktop: string;
  imageTablet: string | null;
  imageMobile: string | null;
  ctaText: string | null;
  ctaLink: string | null;
};

export function HeroSection({ banners = [] }: { banners?: HeroBannerData[] }) {
  const [index, setIndex] = useState(0);
  const hasBanners = banners.length > 0;
  const current = hasBanners ? banners[index]! : null;

  useEffect(() => {
    if (banners.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [banners.length]);

  const whatsappHref = getWhatsAppLink(
    siteConfig.whatsappPhone,
    "Olá! Quero ajuda para encontrar um imóvel com a Weise Capital."
  );

  const title =
    current?.title ??
    "Imóveis bem localizados, com atendimento que fecha negócio.";
  const subtitle =
    current?.subtitle?.trim() ||
    (current
      ? null
      : "Venda e locação para famílias e investidores. Curadoria clara, resposta rápida no WhatsApp e acompanhamento até a assinatura.");

  function go(delta: number) {
    if (!banners.length) return;
    setIndex((i) => (i + delta + banners.length) % banners.length);
  }

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden md:min-h-screen md:items-center">
      {/* Fallback navy */}
      <div className="absolute inset-0 z-0 bg-[#0B1F3A]" />

      {/* Fotos via background-image (mais confiável que next/image no hero) */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{ backgroundImage: `url(${banner.imageDesktop})` }}
          role="img"
          aria-label={banner.title}
          aria-hidden={i !== index}
        />
      ))}

      {!hasBanners && (
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(165deg,#0B1F3A_0%,#132a4a_42%,#1a3558_100%)]" />
      )}

      {/* Overlay leve — só para legibilidade do texto */}
      <div
        className={cn(
          "absolute inset-0 z-[2]",
          hasBanners
            ? "bg-gradient-to-r from-black/55 via-black/25 to-black/10"
            : "bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.12),transparent_55%)]"
        )}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-24">
        <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-white/80 uppercase">
          Weise Capital · Imobiliária
        </p>

        <h1 className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.08]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {current?.ctaText && current?.ctaLink ? (
            <Button
              size="lg"
              className="h-12 bg-white px-6 text-primary hover:bg-white/90"
              asChild
            >
              <Link href={current.ctaLink}>
                {current.ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 bg-whatsapp px-6 text-whatsapp-foreground hover:bg-whatsapp/90"
              asChild
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Pedir atendimento
              </a>
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
            asChild
          >
            <Link href="/imoveis">
              Ver imóveis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {banners.length > 1 && (
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="rounded-full border border-white/30 bg-black/20 p-2 text-white backdrop-blur-sm hover:bg-black/35"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  )}
                  aria-label={`Ir para banner ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded-full border border-white/30 bg-black/20 p-2 text-white backdrop-blur-sm hover:bg-black/35"
              aria-label="Próximo banner"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-12 md:mt-14">
          <PropertySearch />
        </div>
      </div>
    </section>
  );
}
