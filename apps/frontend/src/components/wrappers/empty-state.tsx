import type { ReactNode } from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  /** Título serif; `em` es la palabra final en cursiva. */
  title: string;
  em?: string;
  description?: string;
  Icon?: RemixiconComponentType;
  /** Acción opcional (botón o enlace). */
  children?: ReactNode;
  className?: string;
};

/** Estado vacío calmo: título serif, una línea de apoyo y, si corresponde, una acción. */
export function EmptyState({ title, em, description, Icon, children, className }: Props) {
  return (
    <div className={cn("flex flex-col items-start gap-2 py-8", className)}>
      {Icon && <Icon className="mb-1 size-9 text-muted-foreground" aria-hidden />}
      <h2 className="font-serif text-2xl font-semibold tracking-tight">
        {title} {em && <em className="font-medium">{em}</em>}
      </h2>
      {description && <p className="max-w-xs text-muted-foreground">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
