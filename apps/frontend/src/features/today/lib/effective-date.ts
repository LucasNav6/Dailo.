import type { Task } from "@/models/task.model";

export function effectiveDate(task: Pick<Task, "plannedDate" | "deadline">) {
  return task.plannedDate ?? task.deadline;
}

export function isDeadlineOnly(task: Pick<Task, "plannedDate" | "deadline">) {
  return !task.plannedDate && Boolean(task.deadline);
}
