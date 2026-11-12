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
  /** YYYY-MM-DD, sin zona horaria */
  plannedDate?: string
  /** YYYY-MM-DD, sin zona horaria */
  deadline?: string
  timeOfDay?: TimeOfDay
  essential: boolean
  position: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  deletedAt?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface Section {
  id: string
  projectId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface Setting {
  key: string
  value: unknown
}
