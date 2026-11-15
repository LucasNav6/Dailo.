import { RiAddLine, RiInboxArchiveLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";

/** Estado vacío del Inbox con la invitación a capturar. */
export function EmptyInbox() {
  return (
    <EmptyState
      className="py-8"
      icon={<RiInboxArchiveLine aria-hidden />}
      title={<>Tu inbox está <Emphasis>vacío.</Emphasis></>}
      description="Anotá lo que se te ocurra sin pensar dónde va. Después lo ordenás."
      action={
        <Button className="[&_svg]:size-5">
          <RiAddLine aria-hidden />
          Capturar algo
        </Button>
      }
    />
  );
}
