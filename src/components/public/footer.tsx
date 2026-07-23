import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { publicNav, siteConfig } from "@/config/site";
import { getWhatsAppLink } from "@/lib/utils/format";

export function Footer() {
  const whatsappHref = getWhatsAppLink(
    siteConfig.whatsappPhone,
    "Olá! Vim pelo site da Weise Capital."
  );

  return (
    <footer className="border-t border-border/80 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="rounded-md bg-white px-3 py-2 inline-block">
              <BrandLogo className="h-8" />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/75">
              {siteConfig.description}
            </p>
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-primary-foreground/90 underline-offset-4 hover:underline"
            >
              @weisecapital
            </a>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] uppercase text-primary-foreground/60">
              Navegação
            </h3>
            <ul className="space-y-2.5">
              {publicNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] uppercase text-primary-foreground/60">
              Imóveis
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/imoveis?purpose=SALE"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Venda
                </Link>
              </li>
              <li>
                <Link
                  href="/imoveis?purpose=RENT"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Locação
                </Link>
              </li>
              <li>
                <Link
                  href="/empreendimentos"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Empreendimentos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.14em] uppercase text-primary-foreground/60">
              Atendimento
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Agendar visita
                </Link>
              </li>
              <li>
                <Link
                  href="/politica"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
