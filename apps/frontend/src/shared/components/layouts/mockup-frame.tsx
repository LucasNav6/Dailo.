import type { ReactNode } from "react"
import { NavDock } from "@/components/organisms/nav-dock"

export type MockupNav = "today" | "inbox" | "projects" | "someday" | "none" | false

const NAV_PATH: Partial<Record<MockupNav & string, string>> = {
  today: "/today",
  inbox: "/inbox",
  projects: "/projects",
  someday: "/someday",
}

function MockupFrame({ children, nav = "none", height = 844 }: { children: ReactNode; nav?: MockupNav; height?: number }) {
  return (
    <div className="relative flex w-[390px] flex-col overflow-hidden bg-background font-sans text-foreground" style={{ height }}>
      <main className="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-6">{children}</main>
      {nav !== false && <NavDock embedded activeTo={NAV_PATH[nav]} onNew={() => {}} />}
    </div>
  )
}

export { MockupFrame }
