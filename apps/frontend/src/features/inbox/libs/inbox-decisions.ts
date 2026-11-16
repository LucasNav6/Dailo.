import type { TaskChanges, TimeOfDay } from "@/shared/models/task.model"

export type InboxDecision =
  | { type: "activate"; projectId?: string; plannedDate?: string; timeOfDay?: TimeOfDay }
  | { type: "someday" }
  | { type: "complete" }
  | { type: "discard" }

export function decisionChanges(decision: InboxDecision): TaskChanges {
  switch (decision.type) {
    case "activate":
      return {
        status: "active",
        projectId: decision.projectId,
        plannedDate: decision.plannedDate,
        timeOfDay: decision.plannedDate ? decision.timeOfDay : undefined,
      }
    case "someday":
      return { status: "someday" }
    case "complete":
      return { status: "completed" }
    case "discard":
      return { status: "discarded" }
  }
}

export const NO_PROJECT = "none"
