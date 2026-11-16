import { RiAddLine, RiLightbulbFill } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Emphasis } from "@/shared/components/atoms/emphasis"
import { EmptyState } from "@/shared/components/molecules/empty-state"

export function MaybeEmptyView({ onCapture }: { onCapture: () => void }) {
  return (
    <EmptyState
      icon={<RiLightbulbFill aria-hidden />}
      title={<>Sin ideas <Emphasis>por ahora.</Emphasis></>}
      description="Lo que no querés hacer ahora, pero tampoco olvidar, va acá."
      descriptionClassName="max-w-[310px]"
      action={
        <Button className="[&_svg]:size-5" onClick={onCapture}>
          <RiAddLine aria-hidden />
          Anotar una idea
        </Button>
      }
    />
  )
}
