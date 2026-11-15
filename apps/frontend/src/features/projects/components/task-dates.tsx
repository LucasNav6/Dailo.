import { RiCalendarLine, RiFlagLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export type TaskDatesProps = {
  planned?: string;
  deadline?: { label: string; urgent: boolean };
};

export function TaskDates({ planned, deadline }: TaskDatesProps) {
  if (!planned && !deadline) return null;
  return (
    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
      {planned && (
        <span className="inline-flex items-center gap-1 text-[13px] leading-[1.35] font-medium whitespace-nowrap text-subtle">
          <RiCalendarLine className="size-[15px]" aria-hidden />
          {planned}
        </span>
      )}
      {deadline && (
        <span className={cn("inline-flex items-center gap-1 text-[13px] leading-[1.35] whitespace-nowrap", deadline.urgent ? "font-semibold text-danger-foreground" : "font-medium text-muted-foreground")}>
          <RiFlagLine className={cn("size-[15px]", deadline.urgent ? "text-danger" : "text-[#6A7B70]")} aria-hidden />
          {deadline.label}
        </span>
      )}
    </span>
  );
}
