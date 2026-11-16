import type { ReactNode } from "react"
import { RiAlertLine, RiRefreshLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { EmptyState } from "@/shared/components/molecules/empty-state"

type ErrorLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  secondaryAction?: ReactNode;
};

function ErrorLayout({ title, description, onRetry, secondaryAction }: ErrorLayoutProps) {
  return (
    <div role="alert" className="flex flex-1 flex-col">
      <EmptyState
        tone="danger"
        icon={<RiAlertLine aria-hidden />}
        title={title}
        description={description}
        action={
          <>
            {(onRetry || secondaryAction) && (
              <Button size="lg" onClick={onRetry} className="[&_svg]:size-5">
                <RiRefreshLine aria-hidden />
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
