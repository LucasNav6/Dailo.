import { RiMore2Line } from "@remixicon/react";
import { IconButton } from "@/components/atoms/icon-button";
import type { Scope } from "../data";

export function ScopeList({ scopes }: { scopes: Scope[] }) {
  return (
    <ul className="flex flex-col">
      {scopes.map((scope) => (
        <li key={scope.name} className="flex min-h-16 list-none items-center gap-3.5 border-b border-border">
          <span className="grid size-10 place-items-center rounded-full bg-selected text-base font-semibold">{scope.letter}</span>
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[17px] font-medium">{scope.name}</span>
            <span className="text-sm text-muted-foreground">{scope.projects}</span>
          </span>
          <IconButton aria-label={`Opciones de ${scope.name}`}>
            <RiMore2Line aria-hidden />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}
