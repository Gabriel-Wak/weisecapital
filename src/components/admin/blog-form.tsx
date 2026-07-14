"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBlogPost } from "@/actions/content.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/design-system";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  isPublished: z.boolean(),
});

type FormInput = z.infer<typeof schema>;

export function BlogForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, watch } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false },
  });

  function onSubmit(data: FormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));
    startTransition(async () => {
      const result = await createBlogPost(formData);
      if (result.success) {
        toast.success("Artigo publicado!");
        router.push("/admin/blog");
      } else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Novo Artigo" description="Crie conteúdo para o blog" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4 border-0 p-6 shadow-sm">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label>Resumo</Label>
            <Input {...register("excerpt")} />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo (HTML)</Label>
            <Textarea rows={12} {...register("content")} />
          </div>
          <label className="flex items-center gap-2">
            <Switch
              checked={watch("isPublished")}
              onCheckedChange={(v) => setValue("isPublished", v)}
            />
            <span className="text-sm">Publicar imediatamente</span>
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Artigo"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
