import { RiArrowLeftLine, RiFolderLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Emphasis } from "@/shared/components/atoms/emphasis"
import { IconButton } from "@/shared/components/atoms/icon-button"
import { EmptyState } from "@/shared/components/molecules/empty-state"

export function ProjectNotFoundView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="-mx-3 -mt-2 flex">
        <IconButton aria-label="Volver" className="text-foreground" onClick={onBack}>
          <RiArrowLeftLine aria-hidden />
        </IconButton>
      </div>
      <EmptyState
        icon={<RiFolderLine aria-hidden />}
        title={<>Este proyecto <Emphasis>ya no existe.</Emphasis></>}
        description="Pudo eliminarse desde otra pestaña o dispositivo. Tus otros proyectos siguen acá."
        action={<Button onClick={onBack}>Ir a proyectos</Button>}
      />
    </>
  )
}
