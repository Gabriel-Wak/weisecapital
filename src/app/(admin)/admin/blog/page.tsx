import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/design-system";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteBlogButton } from "@/components/admin/delete-blog-button";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  const posts = tenant
    ? await prisma.blogPost.findMany({
        where: { tenantId: tenant.id, deletedAt: null },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Blog" description="Gerencie artigos e conteúdo SEO">
        <Button asChild>
          <Link href="/admin/blog/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Artigo
          </Link>
        </Button>
      </PageHeader>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Publicado" : "Rascunho"}
                  </Badge>
                </TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell className="text-right">
                  <DeleteBlogButton id={post.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
