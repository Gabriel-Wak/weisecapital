import { FadeIn } from "@/components/animations/fade-in";
import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = generateSEO({
  title: "Sobre",
  description: "Conheça a história e os valores da nossa imobiliária premium.",
  url: `${siteConfig.url}/sobre`,
});

export default function SobrePage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <FadeIn>
          <p className="text-sm font-medium tracking-wider text-primary uppercase">
            Sobre Nós
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Excelência em cada detalhe
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="prose prose-lg prose-neutral mt-12 max-w-none">
            <p>
              Somos uma imobiliária premium dedicada a conectar pessoas aos
              melhores imóveis do mercado. Com mais de 15 anos de experiência,
              oferecemos um atendimento personalizado e consultoria especializada
              em compra, venda e locação de imóveis de alto padrão.
            </p>
            <p>
              Nossa missão é transformar a experiência imobiliária, combinando
              tecnologia de ponta com o toque humano que faz a diferença. Cada
              cliente é único, e cada imóvel conta uma história.
            </p>
            <h2>Nossos Valores</h2>
            <ul>
              <li><strong>Transparência</strong> — Informações claras e honestas em cada negociação</li>
              <li><strong>Excelência</strong> — Compromisso com a qualidade em todos os serviços</li>
              <li><strong>Inovação</strong> — Tecnologia a serviço da melhor experiência</li>
              <li><strong>Confiança</strong> — Relacionamentos duradouros baseados em resultados</li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
