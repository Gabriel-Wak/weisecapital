export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Weise Capital Imóveis",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Plataforma imobiliária premium para compra, venda e locação de imóveis de alto padrão.",
  keywords: [
    "imóveis",
    "apartamentos",
    "casas",
    "venda",
    "locação",
    "imobiliária",
    "empreendimentos",
  ],
  links: {
    whatsapp: "https://wa.me/5511999999999",
    instagram: "https://instagram.com",
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
  { title: "Home", href: "/" },
  { title: "Sobre", href: "/sobre" },
  { title: "Empreendimentos", href: "/empreendimentos" },
  { title: "Imóveis", href: "/imoveis" },
  { title: "Venda", href: "/imoveis?purpose=SALE" },
  { title: "Locação", href: "/imoveis?purpose=RENT" },
  { title: "Blog", href: "/blog" },
  { title: "Contato", href: "/contato" },
] as const;
