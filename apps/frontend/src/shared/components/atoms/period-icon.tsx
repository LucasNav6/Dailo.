import { RiSunLine } from "@remixicon/react"

export type Period = "morning" | "midday" | "afternoon" | "evening"

const SUNRISE = "M2 17h20v2H2zM7 15a5 5 0 0 1 10 0zM11 4h2v3h-2zM3.5 10.1l1.4-1.4 2.1 2.1-1.4 1.4zM20.5 10.1l-1.4-1.4-2.1 2.1 1.4 1.4z"
const SUNSET = "M2 19h20v-2H2zM7 15a5 5 0 0 1 10 0zM11 3h2v4.2l1.6-1.6 1.4 1.4L12 10.9 8 7l1.4-1.4L11 7.2zM3.5 11.1l1.4-1.4 2.1 2.1-1.4 1.4zM20.5 11.1l-1.4-1.4-2.1 2.1 1.4 1.4z"
const MOON = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"

function Glyph({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function PeriodIcon({ period }: { period: Period }) {
  if (period === "midday") return <RiSunLine className="size-[18px]" aria-hidden />
  return <Glyph path={period === "morning" ? SUNRISE : period === "afternoon" ? SUNSET : MOON} />
}

export { PeriodIcon }
