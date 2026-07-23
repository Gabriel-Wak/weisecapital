import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/weise-logo.png"
      alt="Weise Capital"
      width={200}
      height={72}
      priority={priority}
      className={cn("h-9 w-auto object-contain md:h-10", className)}
    />
  );
}
