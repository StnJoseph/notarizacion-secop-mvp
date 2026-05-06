import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function calcularDiasDesde(isoDate: string): number {
  const fecha = parseISO(isoDate);
  const ahora = new Date();
  const diff = ahora.getTime() - fecha.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatearFechaRelativa(isoDate: string): string {
  try {
    const fecha = parseISO(isoDate);
    return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
  } catch {
    return isoDate;
  }
}

export function getBadgeColor(clasificacion: string): {
  bg: string;
  text: string;
  label: string;
} {
  switch (clasificacion) {
    case "CONSISTENTE":
      return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Consistente" };
    case "INCONSISTENTE":
      return { bg: "bg-rose-50", text: "text-rose-700", label: "Inconsistente" };
    case "ADVERTENCIA":
      return { bg: "bg-amber-50", text: "text-amber-700", label: "Advertencia" };
    case "DATO_AUSENTE":
      return { bg: "bg-slate-50", text: "text-slate-700", label: "Dato Ausente" };
    case "NO_VERIFICABLE":
      return { bg: "bg-slate-50", text: "text-slate-700", label: "No Verificable" };
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", label: clasificacion };
  }
}

export function formatearHash(hash: string, length: number = 10): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

export function copiarAlPortapapeles(texto: string): Promise<void> {
  return navigator.clipboard.writeText(texto);
}