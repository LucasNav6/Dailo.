import { RiAddLine, RiArrowLeftLine } from "@remixicon/react";
import { Emphasis } from "@/components/atoms/emphasis";
import { PillButton } from "@/components/atoms/pill-button";
import { InlineAction } from "@/components/molecules/inline-action";
import { WeekStrip } from "@/components/molecules/week-strip";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { TaskSection } from "@/components/organisms/task-section";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayOtherDayView() {
  return (
    <>
      <TodayHeader eyebrow="Lunes 16 nov" title={<>Tu <Emphasis>mañana.</Emphasis></>} />
      <WeekStrip days={weekDays(16)} />
      <PillButton className="mb-1">
        <RiArrowLeftLine aria-hidden />
        Volver a hoy
      </PillButton>
      <EssentialsBox done={0} max={3} tasks={[{ title: "Enviar factura al cliente" }, { title: "Reunión de arranque", time: "10:00" }]} />
      <TaskSection title="Mañana" period="morning" meta="07–12" tasks={[{ title: "Definir estructura de páginas", time: "09:00" }]} />
      <TaskSection title="Tarde" period="afternoon" meta="15–19" tasks={[{ title: "Turno con el dentista", time: "17:30" }]} />
      <InlineAction icon={<RiAddLine aria-hidden />}>Planificar algo</InlineAction>
    </>
  );
}
