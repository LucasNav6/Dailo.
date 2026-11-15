import { RiAddLine, RiLightbulbFill } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { EmptyState } from "@/components/molecules/empty-state";
import { SomedayHeader } from "../components/someday-header";

export function SomedayEmptyView() {
  return (
    <>
      <SomedayHeader eyebrow="Tal vez · 0" />
      <EmptyState
        icon={<RiLightbulbFill aria-hidden />}
        title={<>Sin ideas <Emphasis>por ahora.</Emphasis></>}
        description="Lo que no querés hacer ahora, pero tampoco olvidar, va acá."
        descriptionClassName="max-w-[310px]"
        action={
          <Button className="[&_svg]:size-5">
            <RiAddLine aria-hidden />
            Anotar una idea
          </Button>
        }
      />
    </>
  );
}
