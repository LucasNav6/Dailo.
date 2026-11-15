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
    { id: "task-detail", title: "Detalle de tarea", source: "V-03e", component: ProjectsTaskDetailView, nav: false, height: 877 },
    { id: "attachment-states", title: "Estados de adjuntos", source: "D-04", component: ProjectsAttachmentStatesView, nav: false },
    { id: "task-not-found", title: "Tarea no existe", source: "N-09", component: ProjectsTaskNotFoundView, nav: "today" },
    { id: "not-found", title: "Proyecto no existe", source: "S-04", component: ProjectsNotFoundView, nav: "projects" },
  ],
};
