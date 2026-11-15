import { useCallback } from "react";
import { projectService } from "@/services/project.service";
import { isDuplicateProjectName } from "../lib/project-name";

/** Crea un proyecto. Devuelve un mensaje de error si el nombre ya existe. */
export function useCreateProject() {
  return useCallback(async (name: string, description: string) => {
    if (await isDuplicateProjectName(name)) return "Ya tenés un proyecto con ese nombre.";
    await projectService.create({ name, description: description || undefined });
  }, []);
}
