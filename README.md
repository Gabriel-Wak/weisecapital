# Weise Capital — Sistema Imobiliário Premium White Label

Plataforma SaaS white label de alto padrão para imobiliárias, com qualidade visual comparável às maiores plataformas do mercado (Loft, QuintoAndar, Viva Real).

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS, Shadcn UI |
| **Animações** | Framer Motion, GSAP, Lenis Smooth Scroll |
| **Estado** | TanStack Query, Zustand, React Hook Form + Zod |
| **Backend** | Next.js Server Actions, Route Handlers |
| **Banco** | PostgreSQL (Supabase) + Prisma ORM |
| **Auth** | Supabase Auth + RBAC |
| **Storage** | Supabase Storage |
| **SEO** | Meta Tags, Open Graph, JSON-LD, Sitemap |

## Arquitetura

```
src/
├── app/
│   ├── (public)/          # Site público
│   │   ├── page.tsx       # Home
│   │   ├── imoveis/       # Listagem + detalhe
│   │   ├── empreendimentos/
│   │   ├── blog/
│   │   ├── sobre/
│   │   ├── contato/
│   │   ├── politica/
│   │   └── lgpd/
│   ├── (admin)/admin/     # Painel administrativo
│   │   ├── page.tsx       # Dashboard
│   │   ├── imoveis/       # CRUD Imóveis
│   │   ├── crm/           # Pipeline Kanban
│   │   └── ...
│   ├── auth/login/        # Autenticação
│   └── api/               # Route Handlers
├── components/
│   ├── ui/                # Shadcn UI
│   ├── public/            # Componentes do site
│   ├── admin/             # Componentes do admin
│   ├── animations/        # Framer Motion + GSAP
│   └── shared/            # Reutilizáveis
├── repositories/          # Repository Pattern (acesso a dados)
├── services/              # Service Layer (lógica de negócio)
├── actions/               # Server Actions
├── lib/
│   ├── auth/              # Session + RBAC
│   ├── supabase/          # Clientes Supabase
│   ├── validators/        # Schemas Zod
│   └── utils/             # Utilitários
├── providers/             # React Providers
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── config/                # Configurações
```

### Padrões Aplicados

- **Clean Architecture** — Separação em camadas (UI → Actions → Services → Repositories → DB)
- **Repository Pattern** — Abstração do acesso a dados
- **Service Layer** — Lógica de negócio centralizada
- **RBAC** — Controle de acesso por roles (Admin, Manager, Broker, Editor)
- **Soft Delete** — Exclusão lógica com restore
- **White Label** — Identidade visual configurável por tenant

## Instalação

### Pré-requisitos

- Node.js 20+
- Conta Supabase (PostgreSQL + Auth + Storage)
- npm ou pnpm

### Passos

```bash
# 1. Clone e instale dependências
git clone <repo-url>
cd weisecapital
npm install

# 2. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase

# 3. Configure o banco
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Inicie o desenvolvimento
npm run dev
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase) |
| `DIRECT_URL` | Connection string direta (migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (server-side) |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API Key Google Maps |
| `JWT_SECRET` | Secret para validação JWT adicional |

## Scripts

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Aplicar schema ao banco
npm run db:migrate   # Criar migration
npm run db:seed      # Popular banco com dados demo
npm run db:studio    # Prisma Studio (GUI)
```

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

```bash
# Ou via CLI
npx vercel
```

### Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie as credenciais para `.env`
3. Execute `npx prisma db push` para criar as tabelas
4. Configure RLS policies conforme necessário

## Módulos

### Site Público
- Home com Hero, busca, destaques, lançamentos, depoimentos, CTA
- Listagem de imóveis com filtros avançados
- Página de detalhe com galeria, mapa, corretor, WhatsApp
- Empreendimentos, Blog, Sobre, Contato
- Política de Privacidade e LGPD

### Painel Admin
- Dashboard com analytics e estatísticas
- CRUD completo de Imóveis, Empreendimentos, Blog, Banners, Vídeos
- CRM com Pipeline Kanban
- Gestão de Leads, Corretores, Usuários
- Agenda, Notificações, Relatórios
- Configurações White Label (logo, cores, domínio)

### Segurança
- Middleware com rate limiting
- Headers de segurança (XSS, CSRF, nosniff)
- RBAC completo
- Sanitização de HTML
- Validação Zod em todas as entradas
- Audit logs

## Licença

Proprietário — Weise Capital © 2026
