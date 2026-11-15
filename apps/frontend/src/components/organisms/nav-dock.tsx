import { RiAddLine } from "@remixicon/react";
import { NavItem } from "@/components/molecules/nav-item";
import { primaryNav } from "@/lib/navigation";

/** Barra inferior móvil: dos destinos, acción Nuevo al centro (no es ruta) y dos destinos más. */
export function NavDock({ onNew }: { onNew: () => void }) {
  const [start, end] = [primaryNav.slice(0, 2), primaryNav.slice(2)];
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 box-border min-h-[88px] border-t border-border bg-surface px-2 pt-2 pb-5 lg:hidden"
    >
      <ul className="grid grid-cols-5 items-center">
        {start.map((item) => (
          <li key={item.to} className="flex justify-center">
            <NavItem {...item} />
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
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
