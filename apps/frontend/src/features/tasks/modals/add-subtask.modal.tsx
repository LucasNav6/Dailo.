import { BottomSheet } from "@/shared/components/molecules/bottom-sheet"
import { ComposeForm } from "@/shared/components/organisms/compose-form"

type AddSubtaskModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (title: string) => Promise<string | undefined>
}

export function AddSubtaskModal({ open, onOpenChange, onSave }: AddSubtaskModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} label="Nueva subtarea">
      {open && <ComposeForm placeholder="Nueva subtarea" withDescription={false} onSave={onSave} />}
    </BottomSheet>
  )
}
