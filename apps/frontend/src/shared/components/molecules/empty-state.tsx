import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "success" | "danger";
  className?: string;
  descriptionClassName?: string;
};

function EmptyState({ icon, title, description, action, tone = "default", className, descriptionClassName }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4 text-center", className)}>
      {tone === "danger" ? (
        <span className="grid size-[72px] place-items-center rounded-full bg-danger-soft text-danger-foreground [&>svg]:size-9">{icon}</span>
      ) : tone === "success" ? (
        <span className="grid size-16 place-items-center rounded-full bg-selected text-foreground [&>svg]:size-9">{icon}</span>
      ) : (
        <span className="inline-flex text-muted-foreground [&>svg]:size-16">{icon}</span>
      )}
      <h2 className="mt-2 font-display text-[30px] leading-[1.08] font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && (
        <p className={cn("text-base leading-normal text-muted-foreground", tone === "danger" ? "max-w-[310px]" : "max-w-[300px]", descriptionClassName)}>{description}</p>
      )}
      {action && <div className="mt-4 flex flex-col items-center gap-1">{action}</div>}
    </div>
  )
}

export { EmptyState }
