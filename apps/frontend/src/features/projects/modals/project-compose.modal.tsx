import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { ComposeForm } from "@/shared/components/organisms/compose-form"
import type { Project } from "@/shared/models/project.model"

type ProjectComposeModalProps = {
  composing: Project | "new" | null
  onClose: () => void
  onSave: (title: string, description: string) => Promise<string | undefined>
}

export function ProjectComposeModal({ composing, onClose, onSave }: ProjectComposeModalProps) {
  return (
    <BottomSheet
      open={composing !== null}
      onOpenChange={(open) => !open && onClose()}
      label={composing === "new" ? "Nuevo proyecto" : "Editar proyecto"}
    >
      {composing !== null && (
        <ComposeForm
          key={composing === "new" ? "new" : composing.id}
          placeholder="Nombre del proyecto"
          initialTitle={composing === "new" ? "" : composing.name}
          initialDescription={composing === "new" ? "" : (composing.description ?? "")}
          onSave={onSave}
        />
      )}
    </BottomSheet>
  )
}
