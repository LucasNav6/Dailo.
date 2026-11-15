import { RiAddLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ChoiceRow } from "@/components/molecules/choice-row";
import { InlineAction } from "@/components/molecules/inline-action";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { InboxHeader } from "../components/inbox-header";
import { InboxList } from "../components/inbox-list";
import { INBOX_ENTRIES } from "../data";

/** Hoja para mover un elemento a un proyecto existente o crear uno nuevo. */
export function InboxMoveProjectSheetView() {
  return (
    <>
      <InboxHeader count={INBOX_ENTRIES.length} />
      <InboxList entries={INBOX_ENTRIES} highlighted={0} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading title="Mover a un proyecto" subtitle="Llamar al contador" />
        <ChoiceRow title="Balance 2025" description="Personal" />
        <ChoiceRow title="Rediseño del sitio" description="Trabajo" selected />
        <ChoiceRow title="Casa" description="Personal" />
        <InlineAction icon={<RiAddLine aria-hidden />}>Nuevo proyecto</InlineAction>
        <div className="mt-2 flex justify-end">
          <Button>Mover</Button>
        </div>
      </SheetOverlay>
    </>
  );
}
