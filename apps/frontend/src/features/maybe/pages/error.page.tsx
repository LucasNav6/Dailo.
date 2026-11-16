import { ErrorLayout } from "@/shared/components/layouts/error-layout"
import { PageColumn } from "@/shared/components/layouts/page-column"

export function MaybeErrorPage({ onRetry }: { onRetry: () => void }) {
  return (
    <PageColumn>
      <ErrorLayout title="No pudimos cargar tus ideas" description="Revisá tu conexión e intentá de nuevo." onRetry={onRetry} />
    </PageColumn>
  )
}
