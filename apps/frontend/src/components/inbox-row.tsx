import { useRef, useState, type PointerEvent } from "react";
import { RiCalendarLine, RiCheckLine, RiDeleteBinLine, RiLightbulbLine, type RemixiconComponentType } from "@remixicon/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { Task } from "@/models/task.model";
import { Button } from "@/components/ui/button";

/** Ancho de cada panel de acción al deslizar (mobile), como en Mail de iOS. */
const PANEL = 76;
const ACTIONS_WIDTH = 3 * PANEL;

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
 * Mobile: deslizar de derecha a izquierda revela tres paneles (Planificar, Tal vez, Descartar).
 * Desktop: las tres acciones son botones; muestran su texto al pasar el mouse.
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
          className="absolute inset-y-0 right-0 flex"
          style={{ width: ACTIONS_WIDTH }}
          // Cerrada, la barra de acciones no es alcanzable ni por teclado ni por lector de pantalla.
          inert={offset === 0}
        >
          <SwipeAction Icon={RiCalendarLine} label="Planificar" tone="bg-secondary text-foreground" onClick={onPlan} />
          <SwipeAction Icon={RiLightbulbLine} label="Tal vez" tone="bg-muted text-muted-foreground" onClick={onSomeday} />
          <SwipeAction Icon={RiDeleteBinLine} label="Descartar" tone="bg-accent text-destructive" onClick={onDiscard} />
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
            <DesktopAction Icon={RiCalendarLine} label="Planificar" onClick={onPlan} />
            <DesktopAction Icon={RiLightbulbLine} label="Tal vez" onClick={onSomeday} />
            <DesktopAction Icon={RiDeleteBinLine} label="Descartar" destructive onClick={onDiscard} />
          </div>
        )}
      </div>
    </li>
  );
}

/** Panel de acción de mobile: ícono y texto debajo, en tonos apagados. */
function SwipeAction({ Icon, label, tone, onClick }: { Icon: RemixiconComponentType; label: string; tone: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ width: PANEL }}
      className={cn("flex h-full flex-col items-center justify-center gap-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring", tone)}
    >
      <Icon className="size-5" aria-hidden />
      {label}
    </button>
  );
}

/** Botón de escritorio: solo ícono; el texto aparece al pasar el mouse. */
function DesktopAction({ Icon, label, destructive, onClick }: { Icon: RemixiconComponentType; label: string; destructive?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "group h-11 w-11 shrink-0 gap-2 overflow-hidden rounded-full px-0 transition-[width,padding] hover:w-auto hover:px-4",
        destructive && "text-destructive"
      )}
    >
      <Icon className="size-5" aria-hidden />
      <span className="hidden whitespace-nowrap group-hover:inline group-focus-visible:inline">{label}</span>
    </Button>
  );
}
