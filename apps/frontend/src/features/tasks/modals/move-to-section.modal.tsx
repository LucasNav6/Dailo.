import { useState } from "react"
import { RiAddLine, RiCheckboxBlankCircleLine, RiRadioButtonLine } from "@remixicon/react"
import { Button } from "@/shared/components/atoms/button"
import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { SheetHeading } from "@/shared/components/molecules/sheet-heading"
import { ComposeForm } from "@/shared/components/organisms/compose-form"
import { cn } from "@/shared/libs/utils"
import type { Section } from "@/shared/models/section.model"

type MoveToSectionModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskTitle: string
  sections: Section[]
  current?: string
  projectName: string
  onMove: (sectionId: string | undefined) => void
  onCreateSection: (name: string) => Promise<string | undefined>
}

export function MoveToSectionModal({ open, onOpenChange, taskTitle, sections, current, projectName, onMove, onCreateSection }: MoveToSectionModalProps) {
  const [choice, setChoice] = useState<string | undefined>(current)
  const [creating, setCreating] = useState(false)
  const options: { id: string | undefined; name: string }[] = [
    { id: undefined, name: "Sin sección" },
    ...sections.map((section) => ({ id: section.id, name: section.name })),
  ]

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} label="Mover a una sección" className="gap-1">
      <SheetHeading title="Mover a una sección" subtitle={taskTitle} />
      {creating ? (
        <ComposeForm
          placeholder="Nombre de la sección"
          withDescription={false}
          note={`En ${projectName}`}
          onSave={async (name) => {
            const error = await onCreateSection(name)
            if (error) return error
            setCreating(false)
          }}
        />
      ) : (
        <>
          <div role="radiogroup" aria-label="Sección" className="flex flex-col">
            {options.map((option) => {
              const selected = option.id === choice
              const Icon = selected ? RiRadioButtonLine : RiCheckboxBlankCircleLine
              return (
                <button
                  key={option.id ?? "none"}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setChoice(option.id)}
                  className="flex min-h-14 items-center gap-4 rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className={cn("inline-flex [&_svg]:size-[22px]", selected ? "text-foreground" : "text-muted-foreground")}>
                    <Icon aria-hidden />
                  </span>
                  <span className="text-[17px] text-foreground">{option.name}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-1 inline-flex h-11 items-center gap-[15px] self-start rounded-lg pl-[5px] text-[15px] font-semibold text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <RiAddLine className="size-[22px]" aria-hidden />
            Nueva sección
          </button>
          <div className="mt-2 flex justify-end">
            <Button onClick={() => onMove(choice)}>Mover</Button>
          </div>
        </>
      )}
    </BottomSheet>
  )
}
