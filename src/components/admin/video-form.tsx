"use client";

import { useTransition } from "react";
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
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/design-system";
import { createVideo } from "@/actions/development.actions";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  url: z.string().url("URL inválida"),
  provider: z.enum(["youtube", "vimeo", "upload"]),
  order: z.coerce.number().default(0),
});

type FormInput = z.infer<typeof schema>;

export function VideoForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, setValue } = useForm<FormInput>({
    resolver: zodResolver(schema) as Resolver<FormInput>,
    defaultValues: { provider: "youtube", order: 0 },
  });

  function onSubmit(data: FormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));

    startTransition(async () => {
      const result = await createVideo(formData);
      if (result.success) {
        toast.success("Vídeo cadastrado!");
        router.push("/admin/videos");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Novo Vídeo" description="YouTube, Vimeo ou URL direta" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4 border-0 p-6 shadow-sm">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input {...register("title")} />
          </div>
          <div className="space-y-2">
            <Label>URL do vídeo</Label>
            <Input {...register("url")} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div className="space-y-2">
            <Label>Provedor</Label>
            <Select
              defaultValue="youtube"
              onValueChange={(v) =>
                setValue("provider", v as FormInput["provider"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="upload">Upload / URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea rows={3} {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input type="number" {...register("order")} />
          </div>
        </Card>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Vídeo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
