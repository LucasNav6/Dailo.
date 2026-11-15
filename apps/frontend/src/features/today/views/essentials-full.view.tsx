import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ChoiceRow } from "@/components/molecules/choice-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TaskSection } from "@/components/organisms/task-section";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

/** Límite de esenciales alcanzado: hoja para elegir cuál reemplazar. */
export function TodayEssentialsFullView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <TaskSection
        title="Esenciales"
        meta="3 de 3"
        tasks={[
          { title: "Llamar al contador", done: true },
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <TaskSection title="Mediodía · ahora" meta="12–15" tasks={[{ title: "Revisar presupuesto", time: "13:30" }]} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Ya tenés 3 esenciales" subtitle="Elegí cuál reemplazar con “Revisar presupuesto”" />
        <ChoiceRow title="Llamar al contador" />
        <ChoiceRow title="Escribir los textos de la home" selected />
        <ChoiceRow title="Comprar regalo para mamá" />
        <div className="mt-2 flex items-center justify-between">
          <Button variant="ghost" className="h-11 px-2">Cancelar</Button>
          <Button>Reemplazar</Button>
        </div>
      </SheetOverlay>
    </>
  );
}
