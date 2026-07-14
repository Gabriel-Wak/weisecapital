"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBanner } from "@/actions/content.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/design-system";
import { FileUpload } from "@/components/shared/file-upload";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageDesktop: z.string().url("Faça upload da imagem"),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

export function BannerForm() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState("");
  const { register, handleSubmit, setValue } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  async function handleUpload(files: File[]) {
    if (!files[0]) return;
    const fd = new FormData();
    fd.append("file", files[0]);
    fd.append("folder", "banners");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      setImageUrl(data.url);
      setValue("imageDesktop", data.url);
      toast.success("Imagem enviada!");
    } else toast.error(data.error ?? "Erro no upload");
  }

  function onSubmit(data: FormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ""));
    startTransition(async () => {
      const result = await createBanner(formData);
      if (result.success) toast.success("Banner criado!");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Novo Banner" description="Banners responsivos do site" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4 border-0 p-6 shadow-sm">
          <FileUpload onUpload={handleUpload} maxFiles={1} />
          {imageUrl && (
            <p className="text-xs text-muted-foreground truncate">{imageUrl}</p>
          )}
          <input type="hidden" {...register("imageDesktop")} />
          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input {...register("subtitle")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Texto CTA</Label>
              <Input {...register("ctaText")} />
            </div>
            <div className="space-y-2">
              <Label>Link CTA</Label>
              <Input {...register("ctaLink")} />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Banner"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
