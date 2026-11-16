import { PageColumn } from "@/shared/components/layouts/page-column"
import { ErrorLayout } from "@/shared/components/layouts/error-layout"

export function ProjectsErrorPage({ onRetry }: { onRetry: () => void }) {
  return (
    <PageColumn>
      <ErrorLayout title="No pudimos cargar tus proyectos" description="Revisá tu conexión e intentá de nuevo." onRetry={onRetry} />
    </PageColumn>
  )
}
