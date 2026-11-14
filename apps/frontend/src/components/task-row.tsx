import { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiMore2Line,
  RiPencilLine,
  RiCornerDownRightLine,
} from "@remixicon/react";
import type { Section } from "@/models/section.model";
import type { Task } from "@/models/task.model";
import type { TaskNode } from "@/services/project.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineAdd } from "@/components/inline-add";

export type TaskActions = {
  toggle: (task: Task) => void;
  edit: (task: Task) => void;
  discard: (task: Task) => void;
  moveToSection: (task: Task, sectionId: string | undefined) => void;
  addSubtask: (parentId: string, title: string) => Promise<unknown>;
};

type Props = {
  node: TaskNode;
  sections: Section[];
  actions: TaskActions;
  /** Las subtareas se mueven y heredan sección de su tarea madre. */
  isSubtask?: boolean;
};

export function TaskRow({ node, sections, actions, isSubtask }: Props) {
  const { task, children } = node;
  const [expanded, setExpanded] = useState(true);
  const [adding, setAdding] = useState(false);
  const done = task.status === "completed";
  const hasChildren = children.length > 0;

  return (
    <li>
      <div className="group flex items-center rounded-sm hover:bg-muted/50">
        <div className="flex size-11 shrink-0 items-center justify-center">
          <Checkbox checked={done} onCheckedChange={() => actions.toggle(task)} aria-label={`${done ? "Reactivar" : "Completar"}: ${task.title}`} />
        </div>
        <button
          type="button"
          onClick={() => actions.edit(task)}
          className="min-h-11 min-w-0 flex-1 rounded-sm py-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className={cn("block text-sm whitespace-pre-line", done && "text-muted-foreground line-through")}>{task.title}</span>
          {task.description && <span className="line-clamp-1 block text-xs text-muted-foreground">{task.description}</span>}
        </button>
        {hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Contraer" : "Expandir"} subtareas de ${task.title}`}
          >
            {expanded ? <RiArrowDownSLine aria-hidden /> : <RiArrowRightSLine aria-hidden />}
            {children.length}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" aria-label={`Más opciones de ${task.title}`}>
              <RiMore2Line aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => actions.edit(task)}>
              <RiPencilLine aria-hidden />
              Editar
            </DropdownMenuItem>
            {!isSubtask && (
              <DropdownMenuItem
                onSelect={() => {
                  setExpanded(true);
                  setAdding(true);
                }}
              >
                <RiCornerDownRightLine aria-hidden />
                Agregar subtarea
              </DropdownMenuItem>
            )}
            {!isSubtask && sections.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Mover a sección</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem disabled={!task.sectionId} onSelect={() => actions.moveToSection(task, undefined)}>
                    Sin sección
                  </DropdownMenuItem>
                  {sections.map((section) => (
                    <DropdownMenuItem key={section.id} disabled={task.sectionId === section.id} onSelect={() => actions.moveToSection(task, section.id)}>
                      {section.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => actions.discard(task)}>
              <RiDeleteBinLine aria-hidden />
              Descartar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {((hasChildren && expanded) || adding) && (
        <ul className="ml-7 flex flex-col">
          {expanded &&
            children.map((child) => <TaskRow key={child.task.id} node={child} sections={sections} actions={actions} isSubtask />)}
          {adding && (
            <li>
              <InlineAdd
                autoFocus
                placeholder="Nueva subtarea"
                onAdd={(title) => actions.addSubtask(task.id, title)}
                onCancel={() => setAdding(false)}
              />
            </li>
          )}
        </ul>
      )}
    </li>
  );
}
