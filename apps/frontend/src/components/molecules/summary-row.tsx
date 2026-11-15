import type { ReactNode } from "react"

/** Fila de resumen: etiqueta a la izquierda y cifra en negrita a la derecha, con borde inferior. */
function SummaryRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between border-b border-border text-base">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export { SummaryRow }
