import { RiAddLine, RiFlowerFill } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Emphasis } from "@/shared/components/atoms/emphasis"
import { EmptyState } from "@/shared/components/molecules/empty-state"

export function ProjectsEmptyView({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      className="py-8"
      icon={<RiFlowerFill aria-hidden />}
      title={<>Todavía no tenés <Emphasis>proyectos.</Emphasis></>}
      description="Creá el primero para agrupar tus tareas."
      action={
        <Button className="[&_svg]:size-5" onClick={onCreate}>
          <RiAddLine aria-hidden />
          Crear proyecto
        </Button>
      }
    />
  )
}
