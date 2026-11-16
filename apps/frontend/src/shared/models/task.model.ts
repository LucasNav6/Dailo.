export type TaskStatus =
  | "inbox"
  | "active"
  | "someday"
  | "completed"
  | "discarded"

export type TimeOfDay = "morning" | "midday" | "afternoon" | "evening"

export interface Task {
  id: string
  title: string
  description?: string
  projectId?: string
  sectionId?: string
  parentId?: string
  status: TaskStatus
  plannedDate?: string
  deadline?: string
  timeOfDay?: TimeOfDay
  essential: boolean
  position: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  deletedAt?: string
}

export type TaskInput = Pick<Task, "title"> &
  Partial<
    Omit<
      Task,
      "id" | "title" | "createdAt" | "updatedAt" | "completedAt" | "deletedAt"
    >
  >

export type TaskChanges = Partial<TaskInput>
