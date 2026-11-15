import { useRef, useState, type PointerEvent } from "react";
import { RiCalendarLine, RiCheckLine, RiDeleteBinLine, RiLightbulbLine, type RemixiconComponentType } from "@remixicon/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { Task } from "@/models/task.model";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Ancho que ocupan las tres acciones al deslizar (mobile): 3 botones de 44 px, huecos y margen. */
const ACTIONS_WIDTH = 3 * 44 + 2 * 4 + 12;

type Props = {
  task: Task;
  onOpen: () => void;
  onToggle: () => void;
  onPlan: () => void;
  onSomeday: () => void;
  onDiscard: () => void;
};

/**
 * Fila de Inbox. El círculo tacha/destacha sin sacar la tarea.
 * Mobile: deslizar de derecha a izquierda revela tres botones ghost (Planificar, Tal vez, Descartar).
 * Desktop: los mismos tres botones, siempre visibles, con tooltip.
 */
export function InboxRow({ task, onOpen, onToggle, onPlan, onSomeday, onDiscard }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const swiped = useRef(false);
  const done = task.status === "completed";
  const showSwipe = !isDesktop && !done;

  const onPointerDown = (event: PointerEvent) => {
    if (isDesktop || done) return;
    swiped.current = false;
    drag.current = { x: event.clientX, start: offset, moved: false };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    if (Math.abs(dx) > 6) current.moved = true;
    if (current.moved) setOffset(Math.min(0, Math.max(-ACTIONS_WIDTH, current.start + dx)));
  };

  const onPointerUp = () => {
    const current = drag.current;
    drag.current = null;
    setDragging(false);
    if (!current?.moved) return;
    swiped.current = true;
    setOffset((value) => (value < -ACTIONS_WIDTH / 2 ? -ACTIONS_WIDTH : 0));
  };

  const onRowClick = () => {
    if (swiped.current) return;
    if (offset !== 0) return setOffset(0);
    if (!done) onOpen();
  };

  return (
    <li className="relative overflow-hidden">
      {showSwipe && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end gap-1 pr-3"
          style={{ width: ACTIONS_WIDTH }}
          // Cerrada, la barra de acciones no es alcanzable ni por teclado ni por lector de pantalla.
          inert={offset === 0}
        >
          <GhostAction Icon={RiCalendarLine} label="Planificar" onClick={onPlan} />
          <GhostAction Icon={RiLightbulbLine} label="Tal vez" onClick={onSomeday} />
          <GhostAction Icon={RiDeleteBinLine} label="Descartar" destructive onClick={onDiscard} />
        </div>
      )}
      <div
        className="relative flex items-start gap-3 bg-background py-1.5 pr-1 pl-0"
        style={
          showSwipe
            ? { transform: `translateX(${offset}px)`, transition: dragging ? "none" : "transform 200ms ease-out", touchAction: "pan-y" }
            : undefined
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="flex size-11 shrink-0 items-center justify-center">
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            aria-label={`${done ? "Destachar" : "Hacerla ahora"}: ${task.title}`}
            onClick={onToggle}
            className="grid size-[22px] place-items-center rounded-full border-2 border-[var(--forest-700)] outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[done=true]:border-brand data-[done=true]:bg-brand dark:border-input"
            data-done={done}
          >
            {done && <RiCheckLine className="size-3.5 text-white" aria-hidden />}
          </button>
        </span>
        <button
          type="button"
          onClick={onRowClick}
          aria-label={done ? undefined : `Procesar: ${task.title}`}
          className="min-h-11 min-w-0 flex-1 rounded-lg py-2.5 text-left text-[17px] leading-snug whitespace-pre-line outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className={cn(done && "text-muted-foreground line-through decoration-1")}>{task.title}</span>
        </button>
        {isDesktop && !done && (
          <div className="flex shrink-0 items-center gap-1 self-center">
            <GhostAction Icon={RiCalendarLine} label="Planificar" tooltip onClick={onPlan} />
            <GhostAction Icon={RiLightbulbLine} label="Tal vez" tooltip onClick={onSomeday} />
            <GhostAction Icon={RiDeleteBinLine} label="Descartar" destructive tooltip onClick={onDiscard} />
          </div>
        )}
      </div>
    </li>
  );
}

type ActionProps = {
  Icon: RemixiconComponentType;
  label: string;
  destructive?: boolean;
  /** Muestra el nombre en un tooltip (solo desktop; en mobile no hay hover). */
  tooltip?: boolean;
  onClick: () => void;
};

/** Botón ghost de solo ícono: sin borde y con un fondo sutil al pasar el mouse. */
function GhostAction({ Icon, label, destructive, tooltip, onClick }: ActionProps) {
  const button = (
    <Button type="button" variant="ghost" size="icon" aria-label={label} onClick={onClick} className={cn("shrink-0", destructive ? "text-destructive" : "text-muted-foreground")}>
      <Icon className="size-5" aria-hidden />
    </Button>
  );
  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
