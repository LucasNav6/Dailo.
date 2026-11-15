import { RiSunLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

/** Hoy sin nada planificado. */
export function TodayEmptyView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EmptyState
        icon={<RiSunLine aria-hidden />}
        title={<>Nada planificado <Emphasis>hoy.</Emphasis></>}
        description="Elegí tus esenciales del día o traé algo desde tu inbox."
        action={
          <>
            <Button>Planificar el día</Button>
            <Button variant="ghost" className="h-11 px-3">Ver inbox · 4</Button>
          </>
        }
      />
    </>
  );
}
