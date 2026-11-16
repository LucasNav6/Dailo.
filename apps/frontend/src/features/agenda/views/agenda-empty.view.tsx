import { RiSunLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Emphasis } from "@/shared/components/atoms/emphasis"
import { EmptyState } from "@/shared/components/molecules/empty-state"

type AgendaEmptyViewProps = { inboxCount: number; onPlan: () => void; onInbox: () => void }

export function AgendaEmptyView({ inboxCount, onPlan, onInbox }: AgendaEmptyViewProps) {
  return (
    <EmptyState
      icon={<RiSunLine aria-hidden />}
      title={<>Nada planificado <Emphasis>hoy.</Emphasis></>}
      description="Elegí tus esenciales del día o traé algo desde tu inbox."
      action={
        <>
          <Button onClick={onPlan}>Planificar el día</Button>
          <Button variant="ghost" className="h-11 px-3" onClick={onInbox}>Ver inbox · {inboxCount}</Button>
        </>
      }
    />
  )
}
