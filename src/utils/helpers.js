export function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(isoString) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export const ESTADOS = ["Pendiente", "Aprobado", "Rechazado", "Enviado", "Entregado"];

export function estadoStyles(estado) {
  switch (estado) {
    case "Aprobado":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    case "Rechazado":
      return "bg-red-500/15 text-red-300 border-red-500/40";
    case "Enviado":
      return "bg-sky-500/15 text-sky-300 border-sky-500/40";
    case "Entregado":
      return "bg-lilac-200/15 text-lilac-200 border-lilac-300/40";
    default:
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
  }
}
