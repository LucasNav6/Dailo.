import { useCallback } from "react";
import { projectService } from "@/services/project.service";
import { isDuplicateProjectName } from "../lib/project-name";

export function useUpdateProject() {
  return useCallback(async (id: string, name: string, description: string) => {
    if (await isDuplicateProjectName(name, id)) return "Ya tenés un proyecto con ese nombre.";
    await projectService.update(id, { name, description: description || undefined });
  }, []);
}
