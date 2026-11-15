import type { ReactNode } from "react"

function Emphasis({ children }: { children: ReactNode }) {
  return <em className="font-medium italic">{children}</em>
}

export { Emphasis }
