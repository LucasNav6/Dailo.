import { RiAddLine } from "@remixicon/react";
import { NavItem } from "@/components/molecules/nav-item";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Barra inferior móvil: dos destinos, acción Nuevo al centro (no es ruta) y dos destinos más.
 * `embedded` la posiciona dentro de su contenedor (marcos de mockup) en vez de fija a la ventana y
 * usa `activeTo` como destino activo en lugar del router.
 */
export function NavDock({ onNew, embedded = false, activeTo }: { onNew: () => void; embedded?: boolean; activeTo?: string }) {
  const [start, end] = [primaryNav.slice(0, 2), primaryNav.slice(2)];
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "inset-x-0 bottom-0 z-40 box-border min-h-[88px] border-t border-border bg-surface px-2 pt-2 pb-5",
        embedded ? "relative shrink-0" : "fixed lg:hidden"
      )}
    >
      <ul className="grid grid-cols-5 items-center">
        {start.map((item) => (
          <li key={item.to} className="flex justify-center">
            <NavItem {...item} active={embedded ? item.to === activeTo : undefined} />
          </li>
        ))}
        <li className="flex justify-center">
          <button
            type="button"
            onClick={onNew}
            aria-label="Nueva tarea"
            className="grid size-14 place-items-center rounded-full border-2 border-primary bg-primary text-primary-foreground outline-none transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95"
          >
            <RiAddLine className="size-[26px]" aria-hidden />
          </button>
        </li>
        {end.map((item) => (
          <li key={item.to} className="flex justify-center">
            <NavItem {...item} active={embedded ? item.to === activeTo : undefined} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
