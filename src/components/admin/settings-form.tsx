"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/design-system";
import { toast } from "sonner";
import { updateTenantSettings } from "@/actions/settings.actions";

const settingsSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  accentColor: z.string(),
  description: z.string().optional(),
  googleAnalytics: z.string().optional(),
  metaPixel: z.string().optional(),
  googleTagManager: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
});

type SettingsInput = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  tenant: {
    name: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    description: string | null;
    googleAnalytics: string | null;
    metaPixel: string | null;
    googleTagManager: string | null;
    maintenanceMode: boolean;
  };
}

export function SettingsForm({ tenant }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema) as Resolver<SettingsInput>,
    defaultValues: {
      name: tenant.name,
      phone: tenant.phone ?? "",
      whatsapp: tenant.whatsapp ?? "",
      email: tenant.email ?? "",
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor,
      description: tenant.description ?? "",
      googleAnalytics: tenant.googleAnalytics ?? "",
      metaPixel: tenant.metaPixel ?? "",
      googleTagManager: tenant.googleTagManager ?? "",
      maintenanceMode: tenant.maintenanceMode,
    },
  });

  function onSubmit(data: SettingsInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v ?? "")));

    startTransition(async () => {
      const result = await updateTenantSettings(formData);
      if (result.success) {
        toast.success("Configurações salvas!");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="White label — personalize a identidade da imobiliária"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Empresa</h3>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea rows={3} {...register("description")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input {...register("whatsapp")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" {...register("email")} />
            </div>
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Cores (White Label)</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Primária</Label>
                <Input type="color" {...register("primaryColor")} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Secundária</Label>
                <Input type="color" {...register("secondaryColor")} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Destaque</Label>
                <Input type="color" {...register("accentColor")} className="h-10" />
              </div>
            </div>
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Analytics & Tracking</h3>
            <div className="space-y-2">
              <Label>Google Analytics (GA4)</Label>
              <Input {...register("googleAnalytics")} placeholder="G-XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Meta Pixel ID</Label>
              <Input {...register("metaPixel")} placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label>Google Tag Manager</Label>
              <Input {...register("googleTagManager")} placeholder="GTM-XXXX" />
            </div>
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Sistema</h3>
            <label className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Modo Manutenção</p>
                <p className="text-sm text-muted-foreground">
                  Exibe página de manutenção no site público
                </p>
              </div>
              <Switch
                checked={watch("maintenanceMode")}
                onCheckedChange={(v) => setValue("maintenanceMode", v)}
              />
            </label>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
