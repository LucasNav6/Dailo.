import type { ReactNode } from "react";
import { RiArrowDownSLine, RiArrowRightSLine, RiMore2Line } from "@remixicon/react";
import { IconButton } from "@/components/atoms/icon-button";
import { cn } from "@/lib/utils";

type ProjectSectionHeaderProps = {
  name: string;
  count: number;
  open: boolean;
  onToggle?: () => void;
  onMore?: () => void;
  handle?: ReactNode;
  dragging?: boolean;
  dimmed?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

export function ProjectSectionHeader({ name, count, open, onToggle, onMore, handle, dragging, dimmed, className, ref, style }: ProjectSectionHeaderProps) {
  const Chevron = open ? RiArrowDownSLine : RiArrowRightSLine;
  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "mt-2.5 flex min-h-12 items-center gap-1.5 border-b border-border",
        dimmed && "opacity-55",
        dragging && "relative z-20 -mx-2 mt-2.5 scale-[1.02] rounded-2xl border-2 border-primary bg-card pr-1 pl-2",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center gap-1.5 self-stretch rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="inline-flex text-muted-foreground [&_svg]:size-[22px]">
          <Chevron aria-hidden />
        </span>
        <span className="truncate text-[17px] font-semibold text-foreground">{name}</span>
        <span className="text-[13px] text-muted-foreground">{count}</span>
      </button>
      <IconButton aria-label={`Opciones de ${name}`} onClick={onMore}>
        <RiMore2Line aria-hidden />
      </IconButton>
      {handle}
    </div>
  );
}
