import { Button } from "@/components/atoms/button"

type OverdueTask = { title: string; due: string };

function OverdueCard({ tasks, actions, onAction }: { tasks: OverdueTask[]; actions: string[]; onAction?: (index: number) => void }) {
  return (
    <section className="mt-1 mb-2 flex flex-col gap-0.5 rounded-2xl bg-danger-soft px-4 pt-3.5 pb-2">
      <h2 className="text-[13px] font-semibold tracking-[0.06em] text-danger-foreground uppercase">Atrasadas · {tasks.length}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.title} className="flex list-none flex-col gap-0.5 py-2">
            <span className="text-[17px] leading-[1.35] text-foreground">{task.title}</span>
            <span className="text-[13px] text-danger-foreground">{task.due}</span>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex gap-5 border-t border-danger-border">
        {actions.map((action, index) => (
          <Button key={action} variant="ghost" onClick={() => onAction?.(index)} className="h-9 rounded-none p-0 text-sm text-danger-foreground hover:bg-transparent hover:underline">
            {action}
          </Button>
        ))}
      </div>
    </section>
  )
}

export { OverdueCard }
