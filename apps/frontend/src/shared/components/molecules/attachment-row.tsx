import { RiFileLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Progress } from "@/shared/components/atoms/progress"

type AttachmentStatus =
  | { kind: "size"; text: string }
  | { kind: "uploading"; progress: number; text: string }
  | { kind: "error"; text: string };

function AttachmentRow({ name, status, variant = "inline" }: { name: string; status: AttachmentStatus; variant?: "inline" | "stacked" }) {
  const icon = (
    <span className="inline-flex text-subtle [&_svg]:size-[22px]">
      <RiFileLine aria-hidden />
    </span>
  )
  if (variant === "inline") {
    return (
      <div className="flex min-h-[52px] items-center gap-[15px]">
        {icon}
        <span className="flex-1 text-[15px] text-foreground">{name}</span>
        <span className="text-[13px] text-muted-foreground">{status.text}</span>
      </div>
    )
  }
  return (
    <div className="flex min-h-14 items-center gap-[15px] border-b border-border">
      {icon}
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-[15px] text-foreground">{name}</span>
        {status.kind === "uploading" && <Progress value={status.progress} className="h-1 w-full" aria-label={`Guardando ${name}`} />}
        <span className={status.kind === "error" ? "text-[13px] text-danger-foreground" : "text-[13px] text-muted-foreground"}>{status.text}</span>
      </span>
      {status.kind === "error" && (
        <Button variant="ghost" className="h-9 px-2 text-danger-foreground">
          Quitar
        </Button>
      )}
    </div>
  )
}

export { AttachmentRow }
