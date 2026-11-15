import { Button } from "@/components/atoms/button"

type SnackbarProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Confirmación breve y flotante ("Guardado en Inbox", "Deshacer"). Se anuncia con role=status. */
function Snackbar({ message, actionLabel, onAction }: SnackbarProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex min-h-12 items-center gap-2 rounded-2xl bg-primary py-2 pr-2 pl-4 text-[15px] text-primary-foreground shadow-lg"
    >
      <span>{message}</span>
      {actionLabel && (
        <Button variant="ghost" className="h-9 px-3 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { Snackbar }
