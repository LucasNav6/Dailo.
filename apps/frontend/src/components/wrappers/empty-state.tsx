import type { ReactNode } from "react";
import { RiFlowerFill, type RemixiconComponentType } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  /** Título serif; `em` es la palabra final en cursiva. */
  title: string;
  em?: string;
  description?: string;
  /** Por defecto, una flor: calma y espacio. */
  Icon?: RemixiconComponentType;
  /** Acción opcional debajo del texto (botón o enlace). Sin `action`, no se muestra nada. */
  action?: ReactNode;
  className?: string;
};

/** Estado vacío calmo, centrado en la pantalla: ícono, título serif, apoyo y acción opcional. */
export function EmptyState({ title, em, description, Icon = RiFlowerFill, action, className }: Props) {
  return (
    <div className={cn("flex min-h-[60svh] flex-col items-center justify-center gap-3 px-6 py-8 text-center", className)}>
      <Icon className="mb-2 size-16 text-muted-foreground" aria-hidden />
      <h2 className="font-serif text-3xl leading-tight font-semibold tracking-tight">
        {title} {em && <em className="font-medium">{em}</em>}
      </h2>
      {description && <p className="max-w-xs text-base leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
