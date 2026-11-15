import { Skeleton } from "@/components/atoms/skeleton";
import { SomedayHeader } from "../components/someday-header";

/** Tal vez cargando: cabecera real y cuatro filas en esqueleto. */
export function SomedayLoadingView() {
  return (
    <div aria-busy="true" className="contents">
      <SomedayHeader eyebrow="Tal vez" />
      <ul>
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="flex list-none flex-col gap-2 border-b border-border py-3.5">
            <Skeleton className="block h-[18px] w-[70%] rounded-lg" />
            <Skeleton className="block h-2.5 w-[30%] rounded-lg" />
          </li>
        ))}
      </ul>
    </div>
  );
}
