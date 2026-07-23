export function BrandLogo({
  className,
  variant = "navy",
}: {
  className?: string;
  priority?: boolean;
  variant?: "navy" | "white";
}) {
  const color = variant === "white" ? "#FFFFFF" : "#0B1F3A";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="Weise Capital"
    >
      {/* Ícone de barras — sem fundo, sem caixa */}
      <svg
        viewBox="0 0 40 32"
        width={40}
        height={32}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <path d="M2 30V10L12 5.5V30H2Z" fill={color} />
        <path d="M14 30V7L24 3V30H14Z" fill={color} />
        <path d="M26 30V4L36 1V30H26Z" fill={color} />
      </svg>
      <span
        className="font-heading text-[12px] font-semibold tracking-[0.18em] uppercase sm:text-[13px] md:text-sm"
        style={{ color }}
      >
        Weise Capital
      </span>
    </span>
  );
}
