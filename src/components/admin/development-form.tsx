"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/design-system";
import { createDevelopment } from "@/actions/development.actions";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(["PLANNING", "CONSTRUCTION", "READY", "DELIVERED"]),
  builder: z.string().optional(),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  address: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  totalUnits: z.coerce.number().optional(),
  videoUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type FormInput = z.infer<typeof schema>;

export function DevelopmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch } = useForm<FormInput>({
    resolver: zodResolver(schema) as Resolver<FormInput>,
    defaultValues: { status: "PLANNING", isFeatured: false },
  });

  function onSubmit(data: FormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, String(v));
    });

    startTransition(async () => {
      const result = await createDevelopment(formData);
      if (result.success) {
        toast.success("Empreendimento criado!");
        router.push("/admin/empreendimentos");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Novo Empreendimento"
        description="Cadastre um lançamento ou projeto"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4 border-0 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome</Label>
              <Input {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label>Construtora</Label>
              <Input {...register("builder")} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                defaultValue="PLANNING"
                onValueChange={(v) =>
                  setValue("status", v as FormInput["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNING">Planejamento</SelectItem>
                  <SelectItem value="CONSTRUCTION">Em construção</SelectItem>
                  <SelectItem value="READY">Pronto</SelectItem>
                  <SelectItem value="DELIVERED">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input {...register("neighborhood")} />
            </div>
            <div className="space-y-2">
              <Label>Preço mínimo (R$)</Label>
              <Input type="number" {...register("minPrice")} />
            </div>
            <div className="space-y-2">
              <Label>Preço máximo (R$)</Label>
              <Input type="number" {...register("maxPrice")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Descrição</Label>
              <Textarea rows={4} {...register("description")} />
            </div>
            <label className="flex items-center gap-2">
              <Switch
                checked={watch("isFeatured")}
                onCheckedChange={(v) => setValue("isFeatured", v)}
              />
              <span className="text-sm">Destaque na home</span>
            </label>
          </div>
        </Card>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
