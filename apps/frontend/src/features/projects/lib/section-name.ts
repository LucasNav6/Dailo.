import { sectionService } from "@/services/section.service";

export const DUPLICATE_SECTION = "Ya hay una sección con ese nombre en este proyecto.";

const normalize = (value: string) => value.trim().toLocaleLowerCase("es");

export async function isDuplicateSectionName(projectId: string, name: string, exceptId?: string) {
  return (await sectionService.findByProjectId(projectId)).some((section) => section.id !== exceptId && normalize(section.name) === normalize(name));
}
