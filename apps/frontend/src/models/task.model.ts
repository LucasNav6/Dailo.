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
  /** Subtarea de otra tarea. */
  parentId?: string
  status: TaskStatus
  /** Cuándo se planea hacerla. YYYY-MM-DD, sin zona horaria. */
  plannedDate?: string
  /** Fecha límite. YYYY-MM-DD, sin zona horaria. */
  deadline?: string
  timeOfDay?: TimeOfDay
  /** Prioridad diaria. */
  essential: boolean
  position: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  /** Descarte recuperable. */
  deletedAt?: string
  /** Marcada como hecha desde Inbox: queda tachada en Inbox hasta que se destilda. */
  completedFromInbox?: boolean
}

/** Datos para crear una tarea. Los campos omitidos toman valores por defecto. */
export type TaskInput = Pick<Task, "title"> &
  Partial<
    Omit<
      Task,
      "id" | "title" | "createdAt" | "updatedAt" | "completedAt" | "deletedAt"
    >
  >

export type TaskChanges = Partial<TaskInput>
