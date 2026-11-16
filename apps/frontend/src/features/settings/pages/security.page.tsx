import { useState } from "react"
import { useDeleteAllData } from "../hooks/delete-all-data.hook"
import { DeleteAllModal } from "../modals/delete-all.modal"
import { SecurityView } from "../views/security.view"

export function SecurityPage() {
  const [open, setOpen] = useState(false)
  const { deleteAll, status } = useDeleteAllData()

  return (
    <>
      <SecurityView status={status} onDelete={() => setOpen(true)} />
      <DeleteAllModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={async () => {
          await deleteAll()
          setOpen(false)
        }}
      />
    </>
  )
}
