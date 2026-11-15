import { Emphasis } from "@/components/atoms/emphasis";
import { WeekStrip } from "@/components/molecules/week-strip";
import { CompletedGroup } from "@/components/organisms/completed-group";
import { Achieved } from "../components/achieved";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

const DONE = ["Llamar al contador", "Escribir los textos de la home", "Comprar regalo para mamá", "Revisar presupuesto", "Maquetar el catálogo", "Pasear al perro"];

export function TodayAchievedView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <Achieved total={6} essentials={3} />
      <CompletedGroup open={false} tasks={DONE.map((title) => ({ title, done: true }))} />
    </>
  );
}
