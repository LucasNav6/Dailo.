import { RiLightbulbFill } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"

export type Idea = { id: string; title: string; note: string; age: string }

type IdeaListViewProps = { ideas: Idea[]; onPlan: (id: string) => void; onDiscard: (id: string) => void }

export function IdeaListView({ ideas, onPlan, onDiscard }: IdeaListViewProps) {
  return (
    <ul className="mt-4">
      {ideas.map((idea) => (
        <li key={idea.id} className="flex list-none items-start gap-3.5 py-2.5 pr-1">
          <span aria-hidden="true" className="mt-0.5 inline-flex shrink-0 text-muted-foreground [&_svg]:size-[22px]">
            <RiLightbulbFill />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-[17px] leading-[1.35]">{idea.title}</span>
            {idea.note ? <span className="line-clamp-3 text-sm leading-[1.4] text-muted-foreground">{idea.note}</span> : null}
            <span className="text-[13px] text-muted-foreground">{idea.age}</span>
            <span className="flex gap-5">
              <Button variant="ghost" className="h-9 rounded-none p-0 text-sm hover:bg-transparent hover:underline" onClick={() => onPlan(idea.id)}>Planificar</Button>
              <Button variant="ghost" className="h-9 rounded-none p-0 text-sm text-muted-foreground hover:bg-transparent hover:underline" onClick={() => onDiscard(idea.id)}>Descartar</Button>
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
