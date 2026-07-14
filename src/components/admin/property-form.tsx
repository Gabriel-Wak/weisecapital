"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, type PropertyFormInput } from "@/lib/validators";
import { createProperty, updateProperty } from "@/actions/property.actions";
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
import { FileUpload } from "@/components/shared/file-upload";
import {
  PROPERTY_TYPES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
} from "@/constants";
import { toast } from "sonner";
import type { Property, Media } from "@prisma/client";

type PropertyWithMedia = Property & { media?: Media[] };

interface PropertyFormProps {
  property?: PropertyWithMedia;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const isEdit = !!property;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageUrls, setImageUrls] = useState<string[]>(
    property?.media?.map((m) => m.url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const uploadedFilesRef = useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormInput>({
    resolver: zodResolver(propertyFormSchema) as Resolver<PropertyFormInput>,
    defaultValues: property
      ? {
          code: property.code,
          title: property.title,
          description: property.description ?? "",
          type: property.type,
          purpose: property.purpose,
          status: property.status,
          price: Number(property.price),
          rentPrice: property.rentPrice ? Number(property.rentPrice) : undefined,
          condoFee: property.condoFee ? Number(property.condoFee) : undefined,
          iptu: property.iptu ? Number(property.iptu) : undefined,
          bedrooms: property.bedrooms,
          suites: property.suites,
          bathrooms: property.bathrooms,
          parkingSpaces: property.parkingSpaces,
          area: property.area ? Number(property.area) : undefined,
          hasPool: property.hasPool,
          isFeatured: property.isFeatured,
          isLaunch: property.isLaunch,
          city: property.city,
          neighborhood: property.neighborhood,
          condominium: property.condominium ?? "",
          address: property.address ?? "",
          state: property.state ?? "",
          zipCode: property.zipCode ?? "",
          virtualTourUrl: property.virtualTourUrl ?? "",
        }
      : {
          type: "APARTMENT",
          purpose: "SALE",
          status: "AVAILABLE",
          bedrooms: 0,
          suites: 0,
          bathrooms: 0,
          parkingSpaces: 0,
          hasPool: false,
          isFeatured: false,
          isLaunch: false,
        },
  });

  async function handleUpload(files: File[]) {
    const newFiles = files.slice(uploadedFilesRef.current);
    if (newFiles.length === 0) return;

    setUploading(true);
    const urls: string[] = [];
    try {
      for (const file of newFiles) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "properties");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      uploadedFilesRef.current = files.length;
      setImageUrls((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} imagem(ns) enviada(s)`);
    } catch {
      toast.error("Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(data: PropertyFormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    imageUrls.forEach((url) => formData.append("imageUrls", url));

    startTransition(async () => {
      const result = isEdit
        ? await updateProperty(property!.id, formData)
        : await createProperty(formData);

      if (result.success) {
        toast.success(isEdit ? "Imóvel atualizado!" : "Imóvel cadastrado!");
        router.push("/admin/imoveis");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Editar Imóvel" : "Novo Imóvel"}
        description={
          isEdit ? `Editando ${property?.code}` : "Cadastre um novo imóvel"
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 border-0 p-6 shadow-sm lg:col-span-2">
            <h3 className="font-semibold">Galeria de Fotos</h3>
            <FileUpload onUpload={handleUpload} />
            {uploading && (
              <p className="text-sm text-muted-foreground">Enviando...</p>
            )}
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageUrls.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 rounded-full bg-destructive px-1.5 text-xs text-white"
                      onClick={() =>
                        setImageUrls((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Informações básicas</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input {...register("code")} placeholder="WC-001" />
                {errors.code && (
                  <p className="text-sm text-destructive">{errors.code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  defaultValue={property?.type ?? "APARTMENT"}
                  onValueChange={(v) =>
                    setValue("type", v as PropertyFormInput["type"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea rows={4} {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label>Tour Virtual 360° (URL embed)</Label>
              <Input
                {...register("virtualTourUrl")}
                placeholder="https://my.matterport.com/show/?m=..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Finalidade</Label>
                <Select
                  defaultValue={property?.purpose ?? "SALE"}
                  onValueChange={(v) =>
                    setValue("purpose", v as PropertyFormInput["purpose"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_PURPOSES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={property?.status ?? "AVAILABLE"}
                  onValueChange={(v) =>
                    setValue("status", v as PropertyFormInput["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm">
            <h3 className="font-semibold">Valores e características</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" {...register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Locação (R$)</Label>
                <Input type="number" {...register("rentPrice")} />
              </div>
              <div className="space-y-2">
                <Label>Dormitórios</Label>
                <Input type="number" {...register("bedrooms")} />
              </div>
              <div className="space-y-2">
                <Label>Banheiros</Label>
                <Input type="number" {...register("bathrooms")} />
              </div>
              <div className="space-y-2">
                <Label>Vagas</Label>
                <Input type="number" {...register("parkingSpaces")} />
              </div>
              <div className="space-y-2">
                <Label>Área (m²)</Label>
                <Input type="number" {...register("area")} />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2">
                <Switch
                  checked={watch("hasPool")}
                  onCheckedChange={(v) => setValue("hasPool", v)}
                />
                <span className="text-sm">Piscina</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={watch("isFeatured")}
                  onCheckedChange={(v) => setValue("isFeatured", v)}
                />
                <span className="text-sm">Destaque</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={watch("isLaunch")}
                  onCheckedChange={(v) => setValue("isLaunch", v)}
                />
                <span className="text-sm">Lançamento</span>
              </label>
            </div>
          </Card>

          <Card className="space-y-4 border-0 p-6 shadow-sm lg:col-span-2">
            <h3 className="font-semibold">Localização</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input {...register("neighborhood")} />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input {...register("address")} />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || uploading}>
            {isPending ? "Salvando..." : isEdit ? "Atualizar" : "Salvar Imóvel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
