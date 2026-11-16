import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/shared/libs/utils"

type ActionRowProps = { icon: ReactNode; children: ReactNode; tone?: "default" | "danger" | "danger-soft" } & Pick<ComponentProps<"button">, "onClick">

function ActionRow({ icon, children, tone = "default", onClick }: ActionRowProps) {
  const className = cn("flex min-h-[52px] w-full items-center gap-4 text-left text-[17px]", tone === "danger" ? "text-danger" : tone === "danger-soft" ? "text-danger-foreground" : "text-foreground")
  const content = (
    <>
      <span className="inline-flex [&_svg]:size-[22px]">{icon}</span>
      {children}
    </>
  )
  return onClick ? (
    <button type="button" onClick={onClick} className={cn(className, "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  )
}

export { ActionRow }
