import { Emphasis } from "@/components/atoms/emphasis";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { TaskSection } from "@/components/organisms/task-section";
import { WeekStrip } from "@/components/molecules/week-strip";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayAppView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EssentialsBox done={1} max={3} tasks={[
          { title: "Llamar al contador", done: true },
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <TaskSection title="Mañana" period="morning" meta="2 hechas" collapsed />
      <TaskSection title="Mediodía" period="midday" badge="Ahora" meta="12–15" tasks={[{ title: "Revisar presupuesto", time: "13:30" }]} />
      <TaskSection
        title="Tarde"
        period="afternoon"
        meta="15–19"
        tasks={[
          { title: "Maquetar el catálogo", time: "16:00" },
          { title: "Pasear al perro", time: "18:00" },
        ]}
      />
      <TaskSection title="Noche" period="evening" meta="19–23" tasks={[{ title: "Leer 20 minutos", time: "21:00" }]} />
    </>
  );
}
