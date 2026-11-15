import { Emphasis } from "@/components/atoms/emphasis";
import { WeekStrip } from "@/components/molecules/week-strip";
import { EssentialsDone } from "@/components/organisms/essentials-done";
import { TaskSection } from "@/components/organisms/task-section";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";
import { DONE_PHRASES } from "../lib/done-phrases";

const ESSENTIALS = [
  { title: "Llamar al contador", done: true },
  { title: "Escribir los textos de la home", done: true },
  { title: "Comprar regalo para mamá", done: true },
];

export function TodayEssentialsDoneView({ open = false }: { open?: boolean }) {
  const phrase = DONE_PHRASES[0];
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EssentialsDone count={3} total={3} lead={phrase.lead} emphasis={phrase.emphasis} open={open} tasks={ESSENTIALS} />
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
    </>
  );
}

export function TodayEssentialsDoneOpenView() {
  return <TodayEssentialsDoneView open />;
}
