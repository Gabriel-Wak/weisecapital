"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compressImages, validateImageFile } from "@/lib/utils/image";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

function FilePreview({ file }: { file: File }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!src) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={file.name} className="h-full w-full object-cover" />
  );
}

export function FileUpload({
  onUpload,
  maxFiles = 10,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const valid = acceptedFiles.filter(validateImageFile);
      if (valid.length !== acceptedFiles.length) {
        toast.error("Alguns arquivos foram rejeitados (tipo ou tamanho inválido)");
      }

      setIsCompressing(true);
      try {
        const compressed = await compressImages(valid);
        const newFiles = [...files, ...compressed].slice(0, maxFiles);
        setFiles(newFiles);
        onUpload(newFiles);
      } finally {
        setIsCompressing(false);
      }
    },
    [files, maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: maxFiles - files.length,
  });

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(newFiles);
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? "Solte os arquivos aqui" : "Arraste imagens ou clique para selecionar"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          WebP automático · Compressão · Máx. {maxFiles} arquivos
        </p>
        {isCompressing && (
          <p className="mt-2 text-xs text-primary">Comprimindo...</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${file.size}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <FilePreview file={file} />
              <div className="absolute inset-x-0 bottom-0 bg-background/80 p-1">
                <p className="truncate text-xs">{file.name}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeFile(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
