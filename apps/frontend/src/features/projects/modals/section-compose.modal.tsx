import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { ComposeForm } from "@/shared/components/organisms/compose-form"
import type { Section } from "@/shared/models/section.model"

type SectionComposeModalProps = {
  sheet: "new" | Section | null
  projectName: string
  onClose: () => void
  onSave: (name: string) => Promise<string | undefined>
}

export function SectionComposeModal({ sheet, projectName, onClose, onSave }: SectionComposeModalProps) {
  return (
    <BottomSheet open={sheet !== null} onOpenChange={(open) => !open && onClose()} label={sheet === "new" ? "Nueva sección" : "Renombrar sección"}>
      {sheet !== null && (
        <ComposeForm
          key={sheet === "new" ? "new" : sheet.id}
          placeholder="Nombre de la sección"
          initialTitle={sheet === "new" ? "" : sheet.name}
          withDescription={false}
          note={`En ${projectName}`}
          onSave={onSave}
        />
      )}
    </BottomSheet>
  )
}
