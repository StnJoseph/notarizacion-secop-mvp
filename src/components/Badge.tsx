interface BadgeProps {
  clasificacion: "CONSISTENTE" | "INCONSISTENTE" | "ADVERTENCIA" | "DATO_AUSENTE" | "NO_VERIFICABLE";
  size?: "sm" | "md" | "lg";
}

export default function Badge({ clasificacion, size = "md" }: BadgeProps) {
  const colors = {
    CONSISTENTE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INCONSISTENTE: "bg-rose-50 text-rose-700 border-rose-200",
    ADVERTENCIA: "bg-amber-50 text-amber-700 border-amber-200",
    DATO_AUSENTE: "bg-slate-50 text-slate-700 border-slate-200",
    NO_VERIFICABLE: "bg-slate-50 text-slate-700 border-slate-200",
  };
  
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  
  return (
    <span className={`inline-block rounded-full font-semibold border ${colors[clasificacion]} ${sizes[size]}`}>
      {clasificacion}
    </span>
  );
}