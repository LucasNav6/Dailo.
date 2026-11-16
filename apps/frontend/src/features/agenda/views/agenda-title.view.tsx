import { Emphasis } from "@/shared/components/atoms/emphasis"

export function AgendaTitleView({ kind }: { kind: "today" | "tomorrow" | "day" }) {
  return <>Tu <Emphasis>{kind === "today" ? "hoy." : kind === "tomorrow" ? "mañana." : "día."}</Emphasis></>
}
