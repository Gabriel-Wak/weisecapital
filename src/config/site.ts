export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Weise Capital",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Imobiliária especialista em venda e locação com atendimento próximo e curadoria de boas localizações.",
  keywords: [
    "imóveis",
    "apartamentos",
    "casas",
    "venda",
    "locação",
    "imobiliária",
    "empreendimentos",
    "Weise Capital",
  ],
  /** Número E.164 sem + (Brasil). Atualize para o WhatsApp real da imobiliária. */
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5511999999999",
  links: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "5511999999999"}`,
    instagram: "https://www.instagram.com/weisecapital/",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
  defaultTenantSlug: "weise-capital",
} as const;

export const adminNav = [
  { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { title: "Imóveis", href: "/admin/imoveis", icon: "Building2" },
  { title: "Empreendimentos", href: "/admin/empreendimentos", icon: "Landmark" },
  { title: "CRM", href: "/admin/crm", icon: "Kanban" },
  { title: "Leads", href: "/admin/leads", icon: "Users" },
  { title: "Corretores", href: "/admin/corretores", icon: "UserCheck" },
  { title: "Usuários", href: "/admin/usuarios", icon: "Users" },
  { title: "Blog", href: "/admin/blog", icon: "FileText" },
  { title: "Banners", href: "/admin/banners", icon: "Image" },
  { title: "Vídeos", href: "/admin/videos", icon: "Video" },
  { title: "Agenda", href: "/admin/agenda", icon: "Calendar" },
  { title: "Relatórios", href: "/admin/relatorios", icon: "BarChart3" },
  { title: "Notificações", href: "/admin/notificacoes", icon: "Bell" },
  { title: "Configurações", href: "/admin/configuracoes", icon: "Settings" },
] as const;

export const publicNav = [
  { title: "Imóveis", href: "/imoveis" },
  { title: "Venda", href: "/imoveis?purpose=SALE" },
  { title: "Locação", href: "/imoveis?purpose=RENT" },
  { title: "Empreendimentos", href: "/empreendimentos" },
  { title: "Sobre", href: "/sobre" },
  { title: "Contato", href: "/contato" },
] as const;
