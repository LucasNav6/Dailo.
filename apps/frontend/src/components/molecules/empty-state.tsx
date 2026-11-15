import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** "danger" usa la paleta de error del diseño. */
  tone?: "default" | "danger";
  className?: string;
};

/** Estado vacío o de error centrado: icono en círculo, título en Fraunces, texto y acciones. */
function EmptyState({ icon, title, description, action, tone = "default", className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4 text-center", className)}>
      <span
        className={cn(
          "grid size-[72px] place-items-center rounded-full [&>svg]:size-9",
          tone === "danger" ? "bg-danger-soft text-danger-foreground" : "bg-selected text-foreground"
        )}
      >
        {icon}
      </span>
      <h2 className="mt-2 font-display text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="max-w-[310px] text-base leading-normal text-muted-foreground">{description}</p>}
      {action && <div className="mt-4 flex flex-col items-center gap-1">{action}</div>}
    </div>
  )
}

export { EmptyState }
