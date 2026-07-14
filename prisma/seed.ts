import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const tenant = await prisma.tenant.upsert({
    where: { slug: "weise-capital" },
    update: {},
    create: {
      name: "Weise Capital Imóveis",
      slug: "weise-capital",
      email: "contato@weise.com.br",
      phone: "(11) 3456-7890",
      whatsapp: "5511999999999",
      city: "São Paulo",
      state: "SP",
      description:
        "Imobiliária premium especializada em imóveis de alto padrão.",
      primaryColor: "#0f172a",
      secondaryColor: "#3b82f6",
      accentColor: "#10b981",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@weise.com.br" },
    update: {},
    create: {
      supabaseId: "seed-admin-id",
      email: "admin@weise.com.br",
      name: "Administrador",
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  const broker = await prisma.user.upsert({
    where: { email: "corretor@weise.com.br" },
    update: {},
    create: {
      supabaseId: "seed-broker-id",
      email: "corretor@weise.com.br",
      name: "Carlos Mendes",
      role: "BROKER",
      phone: "(11) 98765-4321",
      creci: "123456-F",
      tenantId: tenant.id,
    },
  });

  const stages = await Promise.all(
    [
      { name: "Novo", color: "#3b82f6", order: 0 },
      { name: "Contato", color: "#8b5cf6", order: 1 },
      { name: "Qualificado", color: "#f59e0b", order: 2 },
      { name: "Negociação", color: "#ef4444", order: 3 },
      { name: "Fechado", color: "#10b981", order: 4 },
    ].map((stage) =>
      prisma.pipelineStage.upsert({
        where: { id: `stage-${stage.order}-${tenant.id}` },
        update: stage,
        create: { ...stage, id: `stage-${stage.order}-${tenant.id}`, tenantId: tenant.id },
      })
    )
  );

  const category = await prisma.category.upsert({
    where: { slug: "alto-padrao" },
    update: {},
    create: { name: "Alto Padrão", slug: "alto-padrao" },
  });

  const properties = [
    {
      code: "WC-001",
      title: "Apartamento Luxo — Jardins",
      slug: "apartamento-luxo-jardins-wc001",
      type: "APARTMENT" as const,
      purpose: "SALE" as const,
      price: 2500000,
      bedrooms: 3,
      suites: 2,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 180,
      city: "São Paulo",
      neighborhood: "Jardins",
      isFeatured: true,
      hasPool: true,
    },
    {
      code: "WC-002",
      title: "Cobertura Duplex — Moema",
      slug: "cobertura-duplex-moema-wc002",
      type: "PENTHOUSE" as const,
      purpose: "SALE" as const,
      price: 5800000,
      bedrooms: 4,
      suites: 3,
      bathrooms: 5,
      parkingSpaces: 4,
      area: 350,
      city: "São Paulo",
      neighborhood: "Moema",
      isFeatured: true,
      isLaunch: true,
      hasPool: true,
    },
    {
      code: "WC-003",
      title: "Loft Industrial — Vila Madalena",
      slug: "loft-industrial-vila-madalena-wc003",
      type: "LOFT" as const,
      purpose: "RENT" as const,
      price: 8500,
      rentPrice: 8500,
      bedrooms: 1,
      suites: 1,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 95,
      city: "São Paulo",
      neighborhood: "Vila Madalena",
      isFeatured: true,
    },
    {
      code: "WC-004",
      title: "Casa em Condomínio — Alphaville",
      slug: "casa-condominio-alphaville-wc004",
      type: "HOUSE" as const,
      purpose: "SALE" as const,
      price: 3200000,
      bedrooms: 4,
      suites: 2,
      bathrooms: 4,
      parkingSpaces: 3,
      area: 280,
      city: "Barueri",
      neighborhood: "Alphaville",
      hasPool: true,
    },
    {
      code: "WC-005",
      title: "Studio Moderno — Pinheiros",
      slug: "studio-moderno-pinheiros-wc005",
      type: "STUDIO" as const,
      purpose: "RENT" as const,
      price: 3200,
      rentPrice: 3200,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 42,
      city: "São Paulo",
      neighborhood: "Pinheiros",
    },
    {
      code: "WC-006",
      title: "Apartamento Garden — Brooklin",
      slug: "apartamento-garden-brooklin-wc006",
      type: "APARTMENT" as const,
      purpose: "BOTH" as const,
      price: 1800000,
      rentPrice: 12000,
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      parkingSpaces: 2,
      area: 120,
      city: "São Paulo",
      neighborhood: "Brooklin",
      isLaunch: true,
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: prop.slug } },
      update: {},
      create: {
        ...prop,
        description: `<p>Imóvel de alto padrão localizado em ${prop.neighborhood}, ${prop.city}. Acabamento premium, localização privilegiada e infraestrutura completa.</p>`,
        tenantId: tenant.id,
        brokerId: broker.id,
        categoryId: category.id,
        features: {
          create: [
            { name: "Ar condicionado", value: "Central" },
            { name: "Piso", value: "Porcelanato" },
            { name: "Vista", value: "Panorâmica" },
          ],
        },
      },
    });
  }

  await prisma.development.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "residencial-parque-jardins" } },
    update: {},
    create: {
      name: "Residencial Parque Jardins",
      slug: "residencial-parque-jardins",
      description: "Empreendimento de alto padrão com área de lazer completa.",
      status: "CONSTRUCTION",
      builder: "Construtora Premium",
      city: "São Paulo",
      neighborhood: "Jardins",
      minPrice: 1200000,
      maxPrice: 4500000,
      totalUnits: 120,
      isFeatured: true,
      tenantId: tenant.id,
      features: {
        create: [
          { name: "Piscina", value: "Adulto e infantil" },
          { name: "Academia", value: "Equipada" },
          { name: "Salão de festas", value: "Sim" },
        ],
      },
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Maria Silva",
        role: "Compradora",
        content: "Excelente atendimento! Encontrei o apartamento dos meus sonhos em poucas semanas.",
        rating: 5,
        tenantId: tenant.id,
        order: 0,
      },
      {
        name: "João Santos",
        role: "Investidor",
        content: "Profissionalismo e transparência em todas as etapas. Recomendo fortemente.",
        rating: 5,
        tenantId: tenant.id,
        order: 1,
      },
      {
        name: "Ana Costa",
        role: "Locatária",
        content: "Processo de locação rápido e sem burocracia. Equipe muito atenciosa.",
        rating: 5,
        tenantId: tenant.id,
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "mercado" },
    update: {},
    create: { name: "Mercado Imobiliário", slug: "mercado" },
  });

  await prisma.blogPost.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "tendencias-mercado-2026" } },
    update: {},
    create: {
      title: "Tendências do Mercado Imobiliário em 2026",
      slug: "tendencias-mercado-2026",
      excerpt: "Confira as principais tendências que moldam o mercado imobiliário premium.",
      content: "<p>O mercado imobiliário de alto padrão continua em expansão...</p>",
      isPublished: true,
      publishedAt: new Date(),
      tenantId: tenant.id,
      categoryId: blogCategory.id,
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        name: "Pedro Oliveira",
        email: "pedro@email.com",
        phone: "(11) 91234-5678",
        message: "Interesse no apartamento WC-001",
        source: "WEBSITE",
        tenantId: tenant.id,
        brokerId: broker.id,
        stageId: stages[0].id,
      },
      {
        name: "Fernanda Lima",
        email: "fernanda@email.com",
        phone: "(11) 99876-5432",
        message: "Quero agendar visita à cobertura",
        source: "WHATSAPP",
        tenantId: tenant.id,
        brokerId: broker.id,
        stageId: stages[2].id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed!");
  console.log(`   Tenant: ${tenant.name}`);
  console.log(`   Users: ${admin.name}, ${broker.name}`);
  console.log(`   Properties: ${properties.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
