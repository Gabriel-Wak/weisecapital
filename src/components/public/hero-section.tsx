"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertySearch } from "./property-search";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/format";

export function HeroSection() {
  const whatsappHref = getWhatsAppLink(
    siteConfig.whatsappPhone,
    "Olá! Quero ajuda para encontrar um imóvel com a Weise Capital."
  );

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden md:min-h-screen md:items-center">
      {/* Full-bleed atmosphere — navy wash + subtle grid, no AI blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#0B1F3A_0%,#132a4a_42%,#1a3558_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-24">
        <motion.p
          className="mb-4 text-xs font-semibold tracking-[0.22em] text-white/70 uppercase"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Weise Capital · Imobiliária
        </motion.p>

        <motion.h1
          className="font-heading max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.75rem] lg:leading-[1.08]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Imóveis bem localizados, com atendimento que fecha negócio.
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Venda e locação para famílias e investidores. Curadoria clara, resposta
          rápida no WhatsApp e acompanhamento até a assinatura.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>

        <div className="mt-12 md:mt-14">
          <PropertySearch />
        </div>
      </div>
    </section>
  );
}
