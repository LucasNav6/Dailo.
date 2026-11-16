export function SaveStatusView({ state }: { state: "idle" | "error" }) {
  if (state !== "error") return null
  return (
    <p role="alert" className="text-sm text-destructive">
      No se pudo guardar. Inténtalo de nuevo.
    </p>
  )
}
