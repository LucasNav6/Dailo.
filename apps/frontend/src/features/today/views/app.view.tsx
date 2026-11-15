import { Emphasis } from "@/components/atoms/emphasis";
import { TaskSection } from "@/components/organisms/task-section";
import { WeekStrip } from "@/components/molecules/week-strip";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

/** Hoy: esenciales, franjas del día y vistazo a la semana. */
export function TodayAppView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <TaskSection
        title="Esenciales"
        meta="1 de 3"
        tasks={[
          { title: "Llamar al contador", done: true },
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <TaskSection title="Mañana" meta="2 hechas" />
      <TaskSection title="Mediodía · ahora" meta="12–15" tasks={[{ title: "Revisar presupuesto", time: "13:30" }]} />
      <TaskSection
        title="Tarde"
        meta="15–19"
        tasks={[
          { title: "Maquetar el catálogo", time: "16:00" },
          { title: "Pasear al perro", time: "18:00" },
        ]}
      />
    </>
  );
}
