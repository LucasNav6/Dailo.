import { useCallback } from "react";
import { projectService } from "@/services/project.service";
import { isDuplicateProjectName } from "../lib/project-name";

/** Edita nombre y descripción de un proyecto. Devuelve un mensaje de error si el nombre choca con otro. */
export function useUpdateProject() {
  return useCallback(async (id: string, name: string, description: string) => {
    if (await isDuplicateProjectName(name, id)) return "Ya tenés un proyecto con ese nombre.";
    await projectService.update(id, { name, description: description || undefined });
  }, []);
}
