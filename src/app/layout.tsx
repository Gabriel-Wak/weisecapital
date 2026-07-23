import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AnalyticsScripts } from "@/components/shared/analytics-scripts";
import { generateSEO } from "@/lib/seo";
import { getDefaultTenant } from "@/lib/tenant";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = generateSEO({});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getDefaultTenant();

  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <AnalyticsScripts
          googleAnalytics={tenant?.googleAnalytics}
          metaPixel={tenant?.metaPixel}
          googleTagManager={tenant?.googleTagManager}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
