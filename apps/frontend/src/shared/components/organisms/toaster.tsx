import { Snackbar } from "@/shared/components/molecules/snackbar"

type ToasterProps = {
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function Toaster({ message, actionLabel, onAction }: ToasterProps) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-[100px] z-[60] lg:bottom-6 lg:left-auto lg:right-6 lg:inset-x-auto">
      <Snackbar message={message} actionLabel={actionLabel} onAction={onAction} />
    </div>
  )
}
