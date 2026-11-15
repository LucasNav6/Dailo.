import { projectService } from "@/services/project.service";

const normalize = (value: string) => value.trim().toLocaleLowerCase("es");

/** ¿Ya hay otro proyecto con ese nombre? `exceptId` excluye al que se está editando. */
export async function isDuplicateProjectName(name: string, exceptId?: string) {
  return (await projectService.findAll()).some((project) => project.id !== exceptId && normalize(project.name) === normalize(name));
}
