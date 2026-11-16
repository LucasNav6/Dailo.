import { RiCheckLine } from "@remixicon/react";
import { Button } from "@/shared/components/atoms/button";
import { Emphasis } from "@/shared/components/atoms/emphasis";

type AchievedProps = { total: number; essentials: number; onTomorrow?: () => void };

function summary(total: number, essentials: number) {
  const did = total === 1 ? "Hiciste la tarea de hoy" : `Hiciste las ${total} tareas de hoy`;
  const withEssentials = essentials === 0 ? "" : essentials === 1 ? ", con tu esencial" : `, con tus ${essentials} esenciales`;
  return `${did}${withEssentials}. Ahora toca descansar.`;
}

export function AchievedView({ total, essentials, onTomorrow }: AchievedProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pt-2 pb-6 text-center">
      <span className="grid size-[72px] place-items-center rounded-full bg-primary text-card">
        <RiCheckLine className="size-10" aria-hidden />
      </span>
      <h2 className="mt-2.5 font-display text-[36px] leading-[1.08] font-semibold tracking-[-0.02em] text-foreground">
        Lo <Emphasis>lograste.</Emphasis>
      </h2>
      <p className="max-w-[300px] text-base leading-normal text-muted-foreground">{summary(total, essentials)}</p>
      <Button variant="outline" className="mt-3" onClick={onTomorrow}>Ver mañana</Button>
    </div>
  );
}
