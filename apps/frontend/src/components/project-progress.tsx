import { cn } from "@/lib/utils";

export const pendingLabel = (pending: number) =>
  pending === 0 ? "Sin pendientes" : pending === 1 ? "1 pendiente" : `${pending} pendientes`;

/** Línea de progreso discreta (decorativa: el dato también va en texto). */
export function ProgressLine({ ratio, className }: { ratio: number; className?: string }) {
  return (
    <span className={cn("block h-1 overflow-hidden rounded-full bg-muted", className)} aria-hidden>
      <span className="block h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${Math.round(ratio * 100)}%` }} />
    </span>
  );
}
