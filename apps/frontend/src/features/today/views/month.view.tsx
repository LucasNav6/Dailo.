import { Emphasis } from "@/components/atoms/emphasis";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { WeekStrip } from "@/components/molecules/week-strip";
import { MonthCalendar } from "@/components/organisms/month-calendar";
import { EssentialsBox } from "@/components/organisms/essentials-box";
import { TaskSection } from "@/components/organisms/task-section";
import { EssentialIcon } from "../components/essential-icon";
import { TodayHeader } from "../components/today-header";
import { NOVEMBER_LOADS, TODAY, weekDays } from "../data";

export function TodayMonthView() {
  return (
    <>
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15)} />
      <EssentialsBox done={1} max={3} tasks={[
          { title: "Escribir los textos de la home", time: "Vie", timeIcon: <EssentialIcon /> },
          { title: "Comprar regalo para mamá" },
        ]}
      />
      <SheetOverlay className="gap-2 pb-7">
        <div className="flex items-center justify-between pb-1">
          <span className="font-display text-[22px] font-semibold text-foreground">
            Noviembre <Emphasis>2026</Emphasis>
          </span>
          <span className="text-sm font-semibold text-foreground">Ir a hoy</span>
        </div>
        <MonthCalendar month={TODAY} today={TODAY} loads={NOVEMBER_LOADS} />
      </SheetOverlay>
    </>
  );
}
