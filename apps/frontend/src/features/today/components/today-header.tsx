import type { ReactNode } from "react";
import { Link } from "react-router";
import { RiCalendarLine, RiSettings3Line } from "@remixicon/react";
import { IconButton } from "@/components/atoms/icon-button";
import { ScreenHeader } from "@/components/molecules/screen-header";

export function TodayHeader({ eyebrow, title, onMonth }: { eyebrow: string; title: ReactNode; onMonth?: () => void }) {
  return (
    <ScreenHeader
      eyebrow={eyebrow}
      title={title}
      actions={
        <>
          <IconButton aria-label="Ver mes" onClick={onMonth}>
            <RiCalendarLine aria-hidden />
          </IconButton>
          <IconButton asChild aria-label="Configuración">
            <Link to="/settings">
              <RiSettings3Line aria-hidden />
            </Link>
          </IconButton>
        </>
      }
    />
  );
}
