import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations/fade-in";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { generateSEO } from "@/lib/seo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });
  if (!tenant) return {};
  const post = await prisma.blogPost.findFirst({
    where: { tenantId: tenant.id, slug, deletedAt: null },
  });
  if (!post) return {};
  return generateSEO({
    title: post.title,
    description: post.excerpt ?? undefined,
    url: `${siteConfig.url}/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });
  if (!tenant) notFound();

  const post = await prisma.blogPost.findFirst({
    where: { tenantId: tenant.id, slug, isPublished: true, deletedAt: null },
    include: { category: true },
  });

  if (!post) notFound();

  return (
    <article className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <FadeIn>
          {post.category && (
            <p className="text-sm font-medium text-primary">{post.category.name}</p>
          )}
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
          {post.publishedAt && (
            <p className="mt-4 text-sm text-muted-foreground">
              {format(post.publishedAt, "dd MMMM yyyy", { locale: ptBR })}
            </p>
          )}
        </FadeIn>
        <FadeIn delay={0.2} className="mt-12">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </FadeIn>
      </div>
    </article>
  );
}
