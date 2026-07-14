import { PageHeader } from "@/components/shared/design-system";
import { CrmKanban } from "@/components/admin/crm-kanban";
import { leadRepository } from "@/repositories/lead.repository";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: siteConfig.defaultTenantSlug },
  });

  if (!tenant) return null;

  const stages = await leadRepository.findByStage(tenant.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM"
        description="Arraste leads entre estágios do pipeline"
      />
      <CrmKanban initialStages={stages} />
    </div>
  );
}
