import { Emphasis } from "@/components/atoms/emphasis";
import { SkeletonEssentials, SkeletonSection } from "@/components/molecules/skeleton-section";
import { WeekStrip } from "@/components/molecules/week-strip";
import { TodayHeader } from "../components/today-header";
import { weekDays } from "../data";

export function TodayLoadingView() {
  return (
    <div aria-busy="true" className="contents">
      <TodayHeader eyebrow="Domingo 15 nov" title={<>Tu <Emphasis>hoy.</Emphasis></>} />
      <WeekStrip days={weekDays(15, false)} />
      <SkeletonEssentials widths={[70, 55, 62]} />
      <SkeletonSection widths={[48, 66]} />
      <SkeletonSection widths={[58]} label={60} />
    </div>
  );
}
