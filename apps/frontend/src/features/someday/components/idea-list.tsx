import { RiLightbulbFill } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { IDEAS, type Idea } from "../data";

/** Ideas sin compromiso: cada una se planifica o se descarta, nunca se tacha. */
export function IdeaList({ ideas = IDEAS, onPlan, onDiscard }: { ideas?: (Idea & { id?: string })[]; onPlan?: (id: string) => void; onDiscard?: (id: string) => void }) {
  return (
    <ul className="mt-4">
      {ideas.map((idea) => (
        <li key={idea.id ?? idea.title} className="flex list-none items-start gap-3.5 py-2.5 pr-1">
          <span aria-hidden="true" className="mt-0.5 inline-flex shrink-0 text-muted-foreground [&_svg]:size-[22px]">
            <RiLightbulbFill />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-[17px] leading-[1.35]">{idea.title}</span>
            {idea.note ? <span className="line-clamp-3 text-sm leading-[1.4] text-muted-foreground">{idea.note}</span> : null}
            <span className="text-[13px] text-muted-foreground">{idea.age}</span>
            <span className="flex gap-5">
              <Button variant="ghost" className="h-9 rounded-none p-0 text-sm hover:bg-transparent hover:underline" onClick={() => idea.id && onPlan?.(idea.id)}>Planificar</Button>
              <Button variant="ghost" className="h-9 rounded-none p-0 text-sm text-muted-foreground hover:bg-transparent hover:underline" onClick={() => idea.id && onDiscard?.(idea.id)}>Descartar</Button>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
