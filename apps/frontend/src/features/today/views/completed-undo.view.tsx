import { Emphasis } from "@/components/atoms/emphasis";
import { Snackbar } from "@/components/molecules/snackbar";
import { WeekStrip } from "@/components/molecules/week-strip";
import { CompletedGroup } from "@/components/organisms/completed-group";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { TaskSection } from "@/components/organisms/task-section";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayCompletedUndoView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EssentialsBox
        done={1}
        max={3}
        tasks={[
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <TaskSection
        title="Tarde"
        period="afternoon"
        meta="15–19"
        tasks={[
          { title: "Maquetar el catálogo", time: "16:00" },
          { title: "Pasear al perro", time: "18:00" },
        ]}
      />
      <CompletedGroup
        open
        tasks={[
          { title: "Revisar presupuesto", done: true, time: "13:30" },
          { title: "Llamar al contador", done: true, time: "09:00" },
        ]}
      />
      <div className="pointer-events-none absolute inset-x-4 bottom-[100px] z-[60]">
        <Snackbar message="Tarea completada" actionLabel="Deshacer" />
      </div>
    </>
  );
}
