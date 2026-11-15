import { RiStarLine, RiTimeLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Chip } from "@/components/atoms/chip";
import { Switch } from "@/components/atoms/switch";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { WeekStrip } from "@/components/molecules/week-strip";
import { weekDays } from "@/features/today/data";
import { InboxHeader } from "../components/inbox-header";
import { InboxList } from "../components/inbox-list";
import { INBOX_ENTRIES } from "../data";

export function InboxPlanSheetView() {
  return (
    <>
      <InboxHeader count={INBOX_ENTRIES.length} />
      <InboxList entries={INBOX_ENTRIES} highlighted={0} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Planificar" subtitle="Llamar al contador" />
        <WeekStrip days={weekDays(16)} />
        <div className="flex min-h-[52px] items-center gap-[15px] text-[17px]">
          <span className="inline-flex text-subtle [&_svg]:size-[22px]">
            <RiTimeLine aria-hidden />
          </span>
          <span className="flex-1">Hora</span>
          <Chip>10:00</Chip>
        </div>
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          <Chip selected>Mañana</Chip>
          <Chip>Mediodía</Chip>
          <Chip>Tarde</Chip>
          <Chip>Noche</Chip>
        </div>
        <div className="flex min-h-[52px] items-center gap-[15px] text-[17px]">
          <span className="inline-flex text-subtle [&_svg]:size-[22px]">
            <RiStarLine aria-hidden />
          </span>
          <span className="flex-1">Esencial ese día</span>
          <Switch checked aria-label="Esencial ese día" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Button variant="ghost" className="h-11 px-2 text-danger-foreground">Quitar plan</Button>
          <Button>Listo</Button>
        </div>
      </SheetOverlay>
    </>
  );
}
