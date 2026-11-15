import { projectService } from "@/services/project.service";

const normalize = (value: string) => value.trim().toLocaleLowerCase("es");

export async function isDuplicateProjectName(name: string, exceptId?: string) {
  return (await projectService.findAll()).some((project) => project.id !== exceptId && normalize(project.name) === normalize(name));
}
