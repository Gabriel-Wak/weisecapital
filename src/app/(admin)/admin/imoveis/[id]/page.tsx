import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: { media: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();

  return <PropertyForm property={property} />;
}
