import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { getDefaultTenant } from "@/lib/tenant";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await getDefaultTenant();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (
    tenant?.maintenanceMode &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/api")
  ) {
    redirect("/maintenance");
  }

  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  );
}
