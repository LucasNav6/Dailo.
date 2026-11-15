import type { Feature } from "../types";
import { ProjectsAttachmentStatesView } from "./views/attachment-states.view";
import { ProjectsCompleteWithSubtasksView } from "./views/complete-with-subtasks.view";
import { ProjectsCompletedView } from "./views/completed.view";
import { ProjectsCreateDescriptionView } from "./views/create-description.view";
import { ProjectsCreateView } from "./views/create.view";
import { ProjectsDeleteView } from "./views/delete.view";
import { ProjectsDetailView } from "./views/detail.view";
import { ProjectsDuplicateNameView } from "./views/duplicate-name.view";
import { ProjectsEmptyView } from "./views/empty.view";
import { ProjectsLimit250View } from "./views/limit-250.view";
import { ProjectsListView } from "./views/list.view";
import { ProjectsLoadingView } from "./views/loading.view";
import { ProjectsMenuView } from "./views/menu.view";
import { ProjectsNoTasksView } from "./views/no-tasks.view";
import { ProjectsNotFoundView } from "./views/not-found.view";
import { ProjectsOptionsView } from "./views/options.view";
import { ProjectsScopeSheetView } from "./views/scope-sheet.view";
import { ProjectsSectionsView } from "./views/sections.view";
import { ProjectsReorderTaskView } from "./views/reorder-task.view";
import { ProjectsReorderSectionView } from "./views/reorder-section.view";
import { ProjectsSectionNewView } from "./views/section-new.view";
import { ProjectsSectionNewWrittenView } from "./views/section-new-written.view";
import { ProjectsSectionDuplicateView } from "./views/section-duplicate.view";
import { ProjectsSectionOptionsView } from "./views/section-options.view";
import { ProjectsSectionRenameView } from "./views/section-rename.view";
import { ProjectsSectionDeleteView } from "./views/section-delete.view";
import { ProjectsSectionEmptyView } from "./views/section-empty.view";
import { ProjectsSectionsCollapsedView } from "./views/sections-collapsed.view";
import { ProjectsTaskMoveSectionView } from "./views/task-move-section.view";
import { ProjectsTaskAddSectionView } from "./views/task-add-section.view";
import { ProjectsSubtasksView } from "./views/subtasks.view";
import { ProjectsTaskDetailView } from "./views/task-detail.view";
import { ProjectsTaskNotFoundView } from "./views/task-not-found.view";

export const projectsFeature: Feature = {
  id: "projects",
  name: "Proyectos y tareas",
  description: "Agrupar tareas en proyectos con un ámbito: del vacío y la creación a la lista, el detalle, las subtareas y la tarea.",
  views: [
    { id: "empty", title: "Proyectos vacío", source: "V-01", component: ProjectsEmptyView, nav: "projects" },
    { id: "loading", title: "Proyectos cargando", source: "N-01", component: ProjectsLoadingView, nav: "projects" },
    { id: "create", title: "Crear proyecto", source: "V-02", component: ProjectsCreateView, nav: "projects" },
    { id: "create-description", title: "Crear con descripción", source: "V-02b", component: ProjectsCreateDescriptionView, nav: "projects" },
    { id: "duplicate-name", title: "Nombre repetido", source: "N-10", component: ProjectsDuplicateNameView, nav: "projects" },
    { id: "limit-250", title: "Límite de 250 caracteres", source: "N-11", component: ProjectsLimit250View, nav: "projects" },
    { id: "scope-sheet", title: "Hoja ámbito", source: "N-14", component: ProjectsScopeSheetView, nav: "projects" },
    { id: "list", title: "Lista", source: "V-03", component: ProjectsListView, nav: "projects" },
    { id: "options", title: "Lista con opciones", source: "V-03b", component: ProjectsOptionsView, nav: "projects" },
    { id: "delete", title: "Eliminar proyecto", source: "S-03", component: ProjectsDeleteView, nav: "projects" },
    { id: "detail", title: "Detalle", source: "V-03c", component: ProjectsDetailView, nav: "projects" },
    { id: "no-tasks", title: "Sin tareas", source: "N-07", component: ProjectsNoTasksView, nav: "projects" },
    { id: "subtasks", title: "Detalle con subtareas", source: "V-03d", component: ProjectsSubtasksView, nav: "projects" },
    { id: "complete-with-subtasks", title: "Completar con subtareas", source: "D-02", component: ProjectsCompleteWithSubtasksView, nav: "projects" },
    { id: "completed", title: "Completadas desplegadas", source: "N-08", component: ProjectsCompletedView, nav: "projects" },
    { id: "menu", title: "Menú del proyecto", source: "D-09", component: ProjectsMenuView, nav: "projects" },
    { id: "sections", title: "Proyecto con secciones", source: "P-01", component: ProjectsSectionsView, nav: "projects", height: 1000 },
    { id: "reorder-task", title: "Ordenar tarea", source: "P-02", component: ProjectsReorderTaskView, nav: "projects", height: 1000 },
    { id: "reorder-section", title: "Ordenar sección", source: "P-03", component: ProjectsReorderSectionView, nav: "projects" },
    { id: "section-new", title: "Nueva sección", source: "P-04", component: ProjectsSectionNewView, nav: "projects" },
    { id: "section-new-written", title: "Nueva sección escrita", source: "P-05", component: ProjectsSectionNewWrittenView, nav: "projects" },
    { id: "section-duplicate", title: "Sección con nombre repetido", source: "P-06", component: ProjectsSectionDuplicateView, nav: "projects" },
    { id: "section-options", title: "Opciones de sección", source: "P-07", component: ProjectsSectionOptionsView, nav: "projects" },
    { id: "section-rename", title: "Renombrar sección", source: "P-08", component: ProjectsSectionRenameView, nav: "projects" },
    { id: "section-delete", title: "Eliminar sección", source: "P-09", component: ProjectsSectionDeleteView, nav: "projects" },
    { id: "section-empty", title: "Sección vacía", source: "P-10", component: ProjectsSectionEmptyView, nav: "projects" },
    { id: "sections-collapsed", title: "Secciones plegadas", source: "P-11", component: ProjectsSectionsCollapsedView, nav: "projects" },
    { id: "task-move-section", title: "Mover tarea a sección", source: "P-12", component: ProjectsTaskMoveSectionView, nav: "projects" },
    { id: "task-add-section", title: "Añadir tarea a sección", source: "P-13", component: ProjectsTaskAddSectionView, nav: "projects" },
    { id: "task-detail", title: "Detalle de tarea", source: "V-03e", component: ProjectsTaskDetailView, nav: false, height: 877 },
    { id: "attachment-states", title: "Estados de adjuntos", source: "D-04", component: ProjectsAttachmentStatesView, nav: false },
    { id: "task-not-found", title: "Tarea no existe", source: "N-09", component: ProjectsTaskNotFoundView, nav: "today" },
    { id: "not-found", title: "Proyecto no existe", source: "S-04", component: ProjectsNotFoundView, nav: "projects" },
  ],
};
