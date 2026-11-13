import { Link } from "react-router";
import { RiSettings3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Línea superior en mayúsculas, p. ej. "Inbox · 3 pendientes". */
  eyebrow: string;
  title: string;
  /** Palabra final en cursiva (una por encabezado). */
  em: string;
};

/** Encabezado de página del sistema de diseño: eyebrow, título serif y acceso a Configuración. */
export function PageHeader({ eyebrow, title, em }: Props) {
  return (
    <header className="flex items-start justify-between gap-4 pb-6">
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[13px] font-semibold tracking-[0.06em] text-[var(--forest-700)] uppercase dark:text-muted-foreground">{eyebrow}</span>
        <h1 className="font-serif text-[32px] leading-[1.08] font-semibold tracking-tight">
          {title} <em className="font-medium">{em}</em>
        </h1>
      </div>
      <Button asChild variant="outline" size="icon" className="shrink-0 lg:hidden">
        <Link to="/settings" aria-label="Configuración">
          <RiSettings3Line aria-hidden />
        </Link>
      </Button>
    </header>
  );
}
