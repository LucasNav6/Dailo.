import { deadlineInfo, plannedLabel } from "@/shared/libs/dates"
import type { Task } from "@/shared/models/task.model"

export function taskDates(task: Pick<Task, "plannedDate" | "deadline">, today: Date = new Date()) {
  return {
    planned: task.plannedDate ? plannedLabel(task.plannedDate, today) : undefined,
    deadline: task.deadline ? deadlineInfo(task.deadline, today) : undefined,
  }
}
