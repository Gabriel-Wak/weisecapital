"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="absolute inset-0 bg-[#0B1F3A]" />

      {/* Todas as imagens no DOM — troca por opacity, sem sumir o conteúdo */}
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={banner.imageDesktop}
            alt={banner.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {!hasBanners && (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(165deg,#0B1F3A_0%,#132a4a_42%,#1a3558_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </>
      )}

      {/* Overlay mais leve para a foto do banner aparecer */}
      <div
        className={cn(
          "absolute inset-0",
          hasBanners
            ? "bg-gradient-to-r from-[#0B1F3A]/75 via-[#0B1F3A]/45 to-[#0B1F3A]/25"
            : "bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.12),transparent_55%)]"
        )}
      />
      {hasBanners && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-[#0B1F3A]/25" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-24">
        <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-white/70 uppercase">
          Weise Capital · Imobiliária
        </p>

        <h1 className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.08]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
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
            className="h-12 border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
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
              className="rounded-full border border-white/25 bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
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
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  )}
                  aria-label={`Ir para banner ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded-full border border-white/25 bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
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
