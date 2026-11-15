import { RiMore2Line } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { IconButton } from "@/components/atoms/icon-button";
import { cn } from "@/lib/utils";
import type { InboxEntry } from "../data";

type InboxListProps = {
  entries: InboxEntry[];
  highlighted?: number;
  onOpen?: (index: number) => void;
  onProcess?: () => void;
};

export function InboxList({ entries, highlighted, onOpen, onProcess }: InboxListProps) {
  return (
    <>
      <Button className="mb-3 self-start" onClick={onProcess}>Procesar {entries.length}</Button>
      <ul className="flex flex-col">
        {entries.map((entry, index) => {
          const text = (
            <>
              <span className="line-clamp-2 text-[17px] leading-[1.35] whitespace-pre-line">{entry.title}</span>
              <span className="text-[13px] text-muted-foreground">{entry.age}</span>
            </>
          );
          return (
            <li
              key={entry.id ?? entry.title}
              className={cn(
                "flex list-none items-center gap-1 py-2",
                highlighted === index ? "-mx-3 rounded-2xl bg-selected py-2 pr-1 pl-3" : "border-b border-border"
              )}
            >
              {onOpen ? (
                <button type="button" onClick={() => onOpen(index)} className="flex min-w-0 flex-1 flex-col gap-[3px] rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  {text}
                </button>
              ) : (
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">{text}</span>
              )}
              <IconButton aria-label="Más opciones" onClick={onOpen ? () => onOpen(index) : undefined}>
                <RiMore2Line aria-hidden />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </>
  );
}
