import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";

/** Contador de subtareas ("2/4") con chevron arriba (abiertas) o abajo (cerradas). */
export function SubtaskToggle({ count, open }: { count: string; open?: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[13px] text-muted-foreground">
      {count}
      {open === undefined ? null : open ? <RiArrowUpSLine className="size-5" aria-hidden /> : <RiArrowDownSLine className="size-5" aria-hidden />}
    </span>
  );
}
