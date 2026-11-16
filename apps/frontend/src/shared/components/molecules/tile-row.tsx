import type { ReactNode } from "react"
import { cn } from "@/shared/libs/utils"

function TileRow({ icon, children, tone = "default" }: { icon: ReactNode; children: ReactNode; tone?: "default" | "danger" }) {
  return (
    <div className="flex min-h-16 items-center gap-4 border-b border-border">
      <span
        className={cn(
          "grid size-10 place-items-center rounded-xl [&_svg]:size-5",
          tone === "danger" ? "bg-danger-soft text-danger" : "bg-selected text-foreground"
        )}
      >
        {icon}
      </span>
      <span className={cn("flex-1 text-[17px] font-medium", tone === "danger" ? "text-danger" : "text-foreground")}>{children}</span>
    </div>
  )
}

export { TileRow }
