import { Emphasis } from "@/components/atoms/emphasis";
import { WeekStrip } from "@/components/molecules/week-strip";
import { OverdueCard } from "@/components/organisms/overdue-card";
import { TaskSection } from "@/components/organisms/task-section";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

/** Hoy con tareas atrasadas arriba y acciones para traerlas o reprogramarlas. */
export function TodayOverdueView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <OverdueCard
        tasks={[
          { title: "Pagar la cuota del monotributo", due: "Venció ayer" },
          { title: "Enviar presupuesto al cliente", due: "Venció hace 3 días" },
        ]}
        actions={["Traer todas a hoy", "Reprogramar"]}
      />
      <TaskSection
        title="Esenciales"
        meta="1 de 3"
        tasks={[
          { title: "Llamar al contador", done: true },
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <TaskSection title="Mediodía · ahora" meta="12–15" tasks={[{ title: "Revisar presupuesto", time: "13:30" }]} />
    </>
  );
}
