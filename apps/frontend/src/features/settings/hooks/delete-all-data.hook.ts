import { useCallback, useState } from "react"
import { useNotify } from "@/shared/hooks/toast.hook"
import { resetAll } from "@/shared/libs/reset"
import { useTheme } from "@/shared/libs/theme"
import { deleteAllDataAdapter } from "../adapters/delete-all-data.adapter"

export type DeleteAllStatus = "idle" | "deleted" | "error"

export function useDeleteAllData() {
  const { setTheme } = useTheme()
  const notify = useNotify()
  const [status, setStatus] = useState<DeleteAllStatus>("idle")

  const deleteAll = useCallback(async () => {
    const result = await deleteAllDataAdapter()
    if (!result.ok) {
      notify(result.error)
      setStatus("error")
      return
    }
    resetAll()
    setTheme("system")
    setStatus("deleted")
  }, [notify, setTheme])

  return { deleteAll, status }
}
