"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

function messageForPath(pathname: string): string {
  if (pathname.startsWith("/imoveis/") && pathname !== "/imoveis") {
    return "Olá! Vi um imóvel no site da Weise Capital e quero mais informações.";
  }
  if (pathname.startsWith("/empreendimentos")) {
    return "Olá! Quero saber mais sobre os empreendimentos da Weise Capital.";
  }
  if (pathname.startsWith("/contato")) {
    return "Olá! Quero falar com um corretor da Weise Capital.";
  }
  return "Olá! Vim pelo site da Weise Capital e quero atendimento.";
}

export function WhatsAppFloat({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const text = message ?? messageForPath(pathname);
  const href = getWhatsAppLink(siteConfig.whatsappPhone, text);

  // Evita sobrepor a barra sticky do imóvel no mobile
  const onPropertyDetail =
    pathname.startsWith("/imoveis/") && pathname !== "/imoveis";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl motion-reduce:transition-none",
        onPropertyDetail
          ? "right-5 bottom-20 md:right-8 md:bottom-8"
          : "right-5 bottom-5 md:right-8 md:bottom-8",
        className
      )}
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
