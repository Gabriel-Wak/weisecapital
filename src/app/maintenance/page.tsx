import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Wrench className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Site em Manutenção
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Estamos realizando melhorias para oferecer uma experiência ainda melhor.
        Voltaremos em breve.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/auth/login">Acesso Administrativo</Link>
      </Button>
    </div>
  );
}
