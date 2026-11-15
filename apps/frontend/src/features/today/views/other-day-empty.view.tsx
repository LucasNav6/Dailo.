import { RiArrowLeftLine, RiCalendarLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { PillButton } from "@/components/atoms/pill-button";
import { EmptyState } from "@/components/molecules/empty-state";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayOtherDayEmptyView() {
  return (
    <>
      <TodayHeader eyebrow="Miércoles 18 nov" title={<>Miércoles <Emphasis>18.</Emphasis></>} />
      <WeekStrip days={weekDays(18, false)} />
      <PillButton className="mb-1">
        <RiArrowLeftLine aria-hidden />
        Volver a hoy
      </PillButton>
      <EmptyState
        icon={<RiCalendarLine aria-hidden />}
        title={<>Nada planificado <Emphasis>ese día.</Emphasis></>}
        description="Podés planificar tareas desde tu inbox o desde cualquier proyecto."
        descriptionClassName="max-w-[310px]"
        action={<Button>Planificar algo</Button>}
      />
    </>
  );
}
