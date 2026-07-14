"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlogPost } from "@/actions/content.actions";
import { toast } from "sonner";

export function DeleteBlogButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deleteBlogPost(id);
          if (result.success) toast.success("Artigo excluído");
          else toast.error(result.error);
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
