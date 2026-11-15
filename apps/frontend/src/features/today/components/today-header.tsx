import type { ReactNode } from "react";
import { RiCalendarLine, RiSettings3Line } from "@remixicon/react";
import { IconButton } from "@/components/atoms/icon-button";
import { ScreenHeader } from "@/components/molecules/screen-header";

/** Cabecera de las vistas de Hoy: fecha, título y accesos a "Ver mes" y "Configuración". */
export function TodayHeader({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  return (
    <ScreenHeader
      eyebrow={eyebrow}
      title={title}
      actions={
        <>
          <IconButton aria-label="Ver mes">
            <RiCalendarLine aria-hidden />
          </IconButton>
          <IconButton aria-label="Configuración">
            <RiSettings3Line aria-hidden />
          </IconButton>
        </>
      }
    />
  );
}
