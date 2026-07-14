import Link from "next/link";
import { publicNav, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <span className="text-lg font-bold">W</span>
              </div>
              <span className="text-lg font-semibold">{siteConfig.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Navegação
            </h3>
            <ul className="space-y-3">
              {publicNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Imóveis
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/imoveis?purpose=SALE" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Venda
                </Link>
              </li>
              <li>
                <Link href="/imoveis?purpose=RENT" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Locação
                </Link>
              </li>
              <li>
                <Link href="/empreendimentos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Empreendimentos
                </Link>
              </li>
              <li>
                <Link href="/imoveis?isLaunch=true" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Lançamentos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/politica" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/lgpd" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  LGPD
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
