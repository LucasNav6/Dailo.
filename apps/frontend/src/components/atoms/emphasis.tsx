import type { ReactNode } from "react"

/** Palabra en cursiva del título ("Tu <hoy.>"), marca tipográfica del diseño. */
function Emphasis({ children }: { children: ReactNode }) {
  return <em className="font-medium italic">{children}</em>
}

export { Emphasis }
