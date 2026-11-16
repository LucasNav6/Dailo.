import { useRef } from "react"
import { es } from "date-fns/locale"
import { RiAddLine, RiAlbumLine, RiCalendarLine, RiCloseLine, RiFolderLine, RiStarLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { Chip } from "@/shared/components/atoms/chip"
import { IconButton } from "@/shared/components/atoms/icon-button"
import { Switch } from "@/shared/components/atoms/switch"
import { AttachmentRow } from "@/shared/components/molecules/attachment-row"
import { Calendar } from "@/shared/components/molecules/calendar"
import { CountHeading } from "@/shared/components/molecules/count-heading"
import { DetailBar } from "@/shared/components/molecules/detail-bar"
import { InlineAction } from "@/shared/components/molecules/inline-action"
import { InlineError } from "@/shared/components/molecules/inline-error"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/molecules/popover"
import { PropertyRow } from "@/shared/components/molecules/property-row"
import { SubtaskRow } from "@/shared/components/molecules/subtask-row"
import { fromISODate, toISODate } from "@/shared/libs/dates"
import type { Task } from "@/shared/models/task.model"
import type { TaskDetailPageState } from "../hooks/task-detail-page.hook"
import { formatSize, TIME_OF_DAY_OPTIONS } from "../libs/task-labels"
import { AutoFieldView } from "./auto-field.view"
import { DatePopoverView } from "./date-popover.view"

type TaskDetailViewProps = { page: TaskDetailPageState; task: Task }

export function TaskDetailView({ page, task }: TaskDetailViewProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const { project, subtasks, attachments, currentSection, planLabel, notice } = page

  return (
    <>
      <DetailBar onBack={page.backToProject} onMore={() => page.openDialog("menu")} />
      {project && (
        <Chip className="h-8 gap-1.5 self-start px-3 text-[13px] [&_svg]:size-4" onClick={page.backToProject}>
          <RiFolderLine aria-hidden />
          {project.name}
        </Chip>
      )}
      <h1 className="mt-3.5 mb-2">
        <AutoFieldView
          key={`t-${task.updatedAt}`}
          label="Título"
          value={task.title}
          onCommit={page.editTitle}
          className="font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-foreground"
        />
      </h1>
      <AutoFieldView
        key={`d-${task.updatedAt}`}
        label="Descripción"
        placeholder="Añadir descripción"
        value={task.description ?? ""}
        onCommit={page.editDescription}
        className="text-[15px] leading-normal text-muted-foreground"
      />

      <div className="mt-5 flex flex-col">
        <PropertyRow icon={<RiCalendarLine aria-hidden />} label="Planificada">
          <Popover>
            <PopoverTrigger asChild>
              <Chip aria-pressed={undefined} aria-label={`Planificada: ${planLabel ?? "sin planificar"}`}>{planLabel ?? "Elegir"}</Chip>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto space-y-2 p-2">
              <Calendar
                mode="single"
                locale={es}
                weekStartsOn={1}
                selected={task.plannedDate ? fromISODate(task.plannedDate) : undefined}
                defaultMonth={task.plannedDate ? fromISODate(task.plannedDate) : undefined}
                onSelect={(day) => day && page.changePlan(toISODate(day), task.timeOfDay)}
              />
              {task.plannedDate && (
                <>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {TIME_OF_DAY_OPTIONS.map(({ key, label }) => (
                      <Chip
                        key={key}
                        selected={task.timeOfDay === key}
                        className="h-8 px-3 text-[13px]"
                        onClick={() => page.changePlan(task.plannedDate, task.timeOfDay === key ? undefined : key)}
                      >
                        {label}
                      </Chip>
                    ))}
                  </div>
                  <Button variant="ghost" className="h-10 w-full" onClick={() => page.changePlan(undefined)}>Quitar planificación</Button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </PropertyRow>
        <PropertyRow icon={<RiStarLine aria-hidden />} label="Esencial ese día">
          <Switch aria-label="Esencial ese día" checked={task.essential} disabled={!task.plannedDate} onCheckedChange={(value) => void page.toggleEssential(value)} />
        </PropertyRow>
        <PropertyRow icon={<RiFolderLine aria-hidden />} label="Sección">
          <Chip aria-pressed={undefined} aria-label={`Sección: ${currentSection?.name ?? "sin sección"}`} onClick={() => page.openDialog("move")}>
            {currentSection?.name ?? "Sin sección"}
          </Chip>
        </PropertyRow>
        <PropertyRow icon={<RiAlbumLine aria-hidden />} label="Fecha límite">
          <DatePopoverView label="Fecha límite" value={task.deadline} onChange={page.changeDeadline} />
        </PropertyRow>
      </div>
      {notice && <div className="mt-2"><InlineError>{notice}</InlineError></div>}

      <CountHeading label="Subtareas" count={subtasks.length === 0 ? 0 : `${page.doneSubtasks}/${subtasks.length}`} />
      <ul className="flex flex-col">
        {subtasks.map((sub) => (
          <SubtaskRow
            key={sub.id}
            title={sub.title}
            checked={sub.status === "completed"}
            onCheckedChange={(done) => page.toggleSubtask(sub.id, done)}
            onRemove={() => page.askDeleteSubtask(sub)}
            className="pl-[5px]"
          />
        ))}
      </ul>
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]" onClick={() => page.openDialog("subtask")}>
        Añadir subtarea
      </InlineAction>

      <CountHeading label="Adjuntos" count={attachments.length} />
      {attachments.map((file) => (
        <div key={file.id} className="flex items-center">
          <div className="flex-1">
            <AttachmentRow name={file.name} status={{ kind: "size", text: formatSize(file.size) }} />
          </div>
          <IconButton aria-label={`Quitar ${file.name}`} onClick={() => page.detach(file.id)}>
            <RiCloseLine aria-hidden />
          </IconButton>
        </div>
      ))}
      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        aria-label="Elegir archivos"
        onChange={async (event) => {
          await page.attach(event.target.files)
          event.target.value = ""
        }}
      />
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]" onClick={() => fileInput.current?.click()}>
        Adjuntar archivo
      </InlineAction>
    </>
  )
}
