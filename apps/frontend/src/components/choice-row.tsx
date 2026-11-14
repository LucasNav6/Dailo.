import type { ReactNode } from "react";
import { RiCheckLine, type RemixiconComponentType } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  Icon: RemixiconComponentType;
  title: string;
  hint?: string;
  selected?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  trailing?: ReactNode;
};

/** Fila de decisión: icono en círculo, título y detalle. */
export function ChoiceRow({ Icon, title, hint, selected, destructive, disabled, onClick, trailing }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-lg border px-3.5 py-3 text-left outline-none transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50",
        destructive ? "border-destructive bg-accent text-destructive" : "border-input bg-field-bg",
        selected && "border-2 border-sidebar-border bg-secondary"
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full bg-secondary", destructive && "bg-field-bg text-destructive")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-semibold">{title}</span>
        {hint && <span className={cn("text-[13px] leading-snug", destructive ? "text-destructive" : "text-muted-foreground")}>{hint}</span>}
      </span>
      {trailing ?? (selected && <RiCheckLine className="size-5" aria-hidden />)}
    </button>
  );
}
