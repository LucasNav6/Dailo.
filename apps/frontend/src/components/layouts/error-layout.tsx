import type { ReactNode } from "react"
import { RiErrorWarningLine } from "@remixicon/react"
import { Button } from "@/components/atoms/button"
import { EmptyState } from "@/components/molecules/empty-state"

type ErrorLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  /** Acción secundaria opcional (p. ej. "Exportar una copia"). */
  secondaryAction?: ReactNode;
};

/** Vista de error a pantalla completa con reintento; mantiene la misma estructura que el resto de vistas. */
function ErrorLayout({ title, description, onRetry, secondaryAction }: ErrorLayoutProps) {
  return (
    <div role="alert" className="flex flex-1 flex-col">
      <EmptyState
        tone="danger"
        icon={<RiErrorWarningLine aria-hidden />}
        title={title}
        description={description}
        action={
          <>
            {onRetry && (
              <Button size="lg" onClick={onRetry}>
                Reintentar
              </Button>
            )}
            {secondaryAction}
          </>
        }
      />
    </div>
  )
}

export { ErrorLayout }
