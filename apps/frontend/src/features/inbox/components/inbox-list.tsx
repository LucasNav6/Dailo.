import { RiMore2Line } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { IconButton } from "@/components/atoms/icon-button";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "../data";

/** Botón "Procesar N" y la lista de elementos capturados; `highlighted` marca la fila con el menú abierto. */
export function InboxList({ entries, highlighted }: { entries: InboxEntry[]; highlighted?: number }) {
  return (
    <>
      <Button className="mb-3 self-start">Procesar {entries.length}</Button>
      <ul className="flex flex-col">
        {entries.map((entry, index) => (
          <li
            key={entry.title}
            className={cn(
              "flex list-none items-center gap-1 py-2",
              highlighted === index ? "-mx-3 rounded-2xl bg-selected py-2 pr-1 pl-3" : "border-b border-border"
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-[17px] leading-[1.35]">{entry.title}</span>
              <span className="text-[13px] text-muted-foreground">{entry.age}</span>
            </span>
            <IconButton aria-label="Más opciones">
              <RiMore2Line aria-hidden />
            </IconButton>
          </li>
        ))}
      </ul>
    </>
  );
}
