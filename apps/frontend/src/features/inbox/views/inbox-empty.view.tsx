import { RiAddLine, RiInboxArchiveLine } from "@remixicon/react";
import { Button } from "@/shared/components/atoms/button";
import { Emphasis } from "@/shared/components/atoms/emphasis";
import { EmptyState } from "@/shared/components/molecules/empty-state";

export function InboxEmptyView({ onCapture }: { onCapture?: () => void }) {
  return (
    <EmptyState
      className="py-8"
      icon={<RiInboxArchiveLine aria-hidden />}
      title={<>Tu inbox está <Emphasis>vacío.</Emphasis></>}
      description="Anotá lo que se te ocurra sin pensar dónde va. Después lo ordenás."
      action={
        <Button className="[&_svg]:size-5" onClick={onCapture}>
          <RiAddLine aria-hidden />
          Capturar algo
        </Button>
      }
    />
  );
}
