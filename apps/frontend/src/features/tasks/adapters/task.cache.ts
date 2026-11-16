import { registerReset } from "@/shared/libs/reset"
import { createCache } from "@/shared/libs/cache"
import type { Attachment } from "@/shared/models/attachment.model"
import type { Task } from "@/shared/models/task.model"

export const tasksCache = createCache<Task[]>()
export const attachmentsCache = createCache<Attachment[]>()

registerReset(() => {
  tasksCache.clear()
  attachmentsCache.clear()
})
