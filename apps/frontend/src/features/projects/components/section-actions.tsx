import { RiAddLine } from "@remixicon/react";

type ActionProps = { onClick?: () => void };

export function SectionAddTask({ onClick }: ActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-[15px] self-start rounded-lg pl-[5px] text-sm font-semibold text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <RiAddLine className="size-5" aria-hidden />
      Añadir tarea
    </button>
  );
}

export function NewSection({ onClick }: ActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex h-12 items-center gap-3 self-start rounded-lg pl-0.5 text-[15px] font-semibold text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <RiAddLine className="size-[22px]" aria-hidden />
      Nueva sección
    </button>
  );
}

export function EmptySectionNote() {
  return <p className="pt-3 pr-0 pb-1 pl-[5px] text-sm leading-normal text-muted-foreground">Esta sección no tiene tareas. Añadí una o arrastrá tareas hasta acá.</p>;
}
