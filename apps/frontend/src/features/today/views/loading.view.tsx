import { Emphasis } from "@/components/atoms/emphasis";
import { SkeletonSection } from "@/components/molecules/skeleton-section";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

/** Hoy cargando: cabecera y semana reales, listas en esqueleto. */
export function TodayLoadingView() {
  return (
    <div aria-busy="true" className="contents">
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15, false)} />
      <SkeletonSection widths={[70, 55, 62]} />
      <SkeletonSection widths={[48, 66]} />
      <SkeletonSection widths={[58]} />
    </div>
  );
}
