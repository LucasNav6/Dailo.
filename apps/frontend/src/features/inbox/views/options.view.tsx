import { RiDeleteBinLine, RiFolderLine, RiLightbulbLine, RiPencilLine, RiSunLine } from "@remixicon/react";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { ActionRow } from "@/components/molecules/action-row";
import { SheetHeading } from "@/components/molecules/sheet-heading";
import { InboxHeader } from "../components/inbox-header";
import { InboxList } from "../components/inbox-list";
import { INBOX_ENTRIES } from "../data";

/** Menú de opciones de un elemento del Inbox. */
export function InboxOptionsView() {
  return (
    <>
      <InboxHeader count={INBOX_ENTRIES.length} />
      <InboxList entries={INBOX_ENTRIES} highlighted={0} />
      <SheetOverlay className="gap-1 pb-6">
        <SheetHeading eyebrow="Inbox" title={INBOX_ENTRIES[0].title} />
        <ActionRow icon={<RiSunLine aria-hidden />}>Planificar</ActionRow>
        <ActionRow icon={<RiFolderLine aria-hidden />}>Mover a un proyecto</ActionRow>
        <ActionRow icon={<RiLightbulbLine aria-hidden />}>Mandar a Tal vez</ActionRow>
        <ActionRow icon={<RiPencilLine aria-hidden />}>Editar</ActionRow>
        <div className="my-1 h-px bg-border" />
        <ActionRow icon={<RiDeleteBinLine aria-hidden />} tone="danger">Eliminar</ActionRow>
      </SheetOverlay>
    </>
  );
}
