import { FadeIn } from "@/components/animations/fade-in";
import { generateSEO } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = generateSEO({
  title: "Política de Privacidade",
  url: `${siteConfig.url}/politica`,
});

export default function PoliticaPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <FadeIn>
          <h1 className="text-4xl font-bold tracking-tight">Política de Privacidade</h1>
          <div className="prose prose-neutral mt-8 max-w-none">
            <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
            <h2>1. Coleta de Dados</h2>
            <p>Coletamos informações fornecidas voluntariamente através de formulários de contato, cadastro e interação com nossos serviços.</p>
            <h2>2. Uso dos Dados</h2>
            <p>Utilizamos seus dados para prestar serviços imobiliários, comunicação, melhorias na plataforma e cumprimento de obrigações legais.</p>
            <h2>3. Compartilhamento</h2>
            <p>Não vendemos seus dados. Compartilhamos apenas quando necessário para prestação de serviços ou exigido por lei.</p>
            <h2>4. Segurança</h2>
            <p>Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais.</p>
            <h2>5. Seus Direitos</h2>
            <p>Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados conforme a LGPD.</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
