import { RiCheckLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";
import { InboxHeader } from "../components/inbox-header";

export function InboxProcessedView() {
  return (
    <>
      <InboxHeader count={0} />
      <EmptyState
        tone="success"
        icon={<RiCheckLine aria-hidden />}
        title={<>Todo en su <Emphasis>lugar.</Emphasis></>}
        description="Procesaste 4 ideas: 2 para hoy, 1 a un proyecto y 1 a Tal vez."
        action={<Button>Ir a Hoy</Button>}
      />
    </>
  );
}
