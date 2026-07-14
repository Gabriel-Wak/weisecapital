import { FadeIn } from "@/components/animations/fade-in";
import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = generateSEO({
  title: "LGPD",
  url: `${siteConfig.url}/lgpd`,
});

export default function LgpdPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold tracking-tight">LGPD — Lei Geral de Proteção de Dados</h1>
          <div className="prose prose-neutral mt-8 max-w-none">
            <p>Em conformidade com a Lei nº 13.709/2018 (LGPD), informamos sobre o tratamento de dados pessoais.</p>
            <h2>Controlador de Dados</h2>
            <p>{siteConfig.name} é o controlador dos dados pessoais coletados através desta plataforma.</p>
            <h2>Base Legal</h2>
            <p>O tratamento de dados é realizado com base no consentimento, execução de contrato, legítimo interesse e cumprimento de obrigação legal.</p>
            <h2>Dados Coletados</h2>
            <ul>
              <li>Nome, e-mail e telefone</li>
              <li>Dados de navegação e cookies</li>
              <li>Informações de interesse em imóveis</li>
            </ul>
            <h2>Encarregado (DPO)</h2>
            <p>Para exercer seus direitos ou esclarecer dúvidas, entre em contato: privacidade@weise.com.br</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
