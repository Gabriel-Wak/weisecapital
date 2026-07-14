import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO } from "@/lib/seo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Blog",
  description: "Notícias, dicas e tendências do mercado imobiliário.",
  url: `${siteConfig.url}/blog`,
});

export default async function BlogPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const posts = await prisma.blogPost.findMany({
    where: { tenantId: tenant.id, isPublished: true, deletedAt: null },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider text-primary uppercase">
              Blog
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Notícias & Tendências
            </h1>
          </div>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full overflow-hidden border-0 shadow-sm transition-all hover:shadow-xl">
                  <div className="p-6">
                    {post.category && (
                      <Badge variant="secondary" className="mb-3">
                        {post.category.name}
                      </Badge>
                    )}
                    <h2 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    {post.publishedAt && (
                      <p className="mt-4 text-xs text-muted-foreground">
                        {format(post.publishedAt, "dd MMM yyyy", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
