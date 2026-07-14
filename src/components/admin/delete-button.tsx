"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ActionResult } from "@/types";

interface DeleteButtonProps {
  id: string;
  label: string;
  onDelete: (id: string) => Promise<ActionResult>;
  size?: "icon" | "sm";
}

export function DeleteButton({
  id,
  label,
  onDelete,
  size = "icon",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Excluir "${label}"? Esta ação não pode ser desfeita.`)) return;

    startTransition(async () => {
      const result = await onDelete(id);
      if (result.success) {
        toast.success("Excluído com sucesso");
      } else {
        toast.error(result.error);
      }
    });
  }

  if (size === "sm") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="mr-1 h-4 w-4" />
        Excluir
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
