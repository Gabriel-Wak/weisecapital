"use client";

import Link from "next/link";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/format";

export function PropertyStickyCta({
  code,
  title,
  brokerPhone,
}: {
  code: string;
  title: string;
  brokerPhone?: string | null;
}) {
  const message = `Olá! Tenho interesse no imóvel ${code} — ${title}. Quero orçamento / visita.`;
  const href = getWhatsAppLink(
    brokerPhone || siteConfig.whatsappPhone,
    message
  );

  return (
    <>
      {/* Desktop sidebar CTA already on page; this is mobile sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur-lg md:hidden">
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-1.5 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/contato">
              <Calendar className="mr-1.5 h-4 w-4" />
              Visita
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
