"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { contactFormSchema, type ContactFormInput } from "@/lib/validators";
import { submitContact } from "@/actions/lead.actions";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

export default function ContatoPage() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  function onSubmit(data: ContactFormInput) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });

    startTransition(async () => {
      const result = await submitContact(formData);
      if (result.success) {
        toast.success("Mensagem enviada com sucesso!");
        reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <p className="text-sm font-medium tracking-wider text-primary uppercase">
              Contato
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Fale Conosco
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Estamos prontos para ajudá-lo. Envie sua mensagem ou entre em
              contato diretamente.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            {[
              { icon: Phone, label: "Telefone", value: "(11) 99999-9999" },
              { icon: Mail, label: "E-mail", value: "contato@weise.com.br" },
              { icon: MapPin, label: "Endereço", value: "São Paulo, SP" },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <Card className="flex items-center gap-4 border-0 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="lg:col-span-2">
            <Card className="border-0 p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" {...register("subject")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" rows={5} {...register("message")} />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  {isPending ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
