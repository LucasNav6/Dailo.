import type { Feature } from "../types";
import { InboxCaptureDescriptionView } from "./views/capture-description.view";
import { InboxCaptureView } from "./views/capture.view";
import { InboxDiscardDraftView } from "./views/discard-draft.view";
import { InboxEmptyView } from "./views/empty.view";
import { InboxListView } from "./views/list.view";
import { InboxLoadingView } from "./views/loading.view";
import { InboxMoveProjectSheetView } from "./views/move-project-sheet.view";
import { InboxOptionsView } from "./views/options.view";
import { InboxPlanSheetView } from "./views/plan-sheet.view";
import { InboxProcessView } from "./views/process.view";
import { InboxProcessedView } from "./views/processed.view";
import { InboxUndoView } from "./views/undo.view";

export const inboxFeature: Feature = {
  id: "inbox",
  name: "Inbox",
  description: "Capturar sin pensar dónde va y después procesar hasta dejarlo vacío.",
  views: [
    { id: "empty", title: "Inbox vacío", source: "I-01", component: InboxEmptyView, nav: "inbox" },
    { id: "loading", title: "Inbox cargando", source: "N-02", component: InboxLoadingView, nav: "inbox" },
    { id: "capture", title: "Capturar", source: "I-02", component: InboxCaptureView, nav: "inbox" },
    { id: "capture-description", title: "Capturar con descripción", source: "I-03", component: InboxCaptureDescriptionView, nav: "inbox" },
    { id: "discard-draft", title: "Descartar borrador", source: "D-01", component: InboxDiscardDraftView, nav: "inbox" },
    { id: "list", title: "Lista", source: "I-04", component: InboxListView, nav: "inbox" },
    { id: "options", title: "Lista con opciones", source: "I-05", component: InboxOptionsView, nav: "inbox" },
    { id: "plan-sheet", title: "Hoja planificar", source: "N-12", component: InboxPlanSheetView, nav: "inbox" },
    { id: "move-project-sheet", title: "Hoja mover a proyecto", source: "N-13", component: InboxMoveProjectSheetView, nav: "inbox" },
    { id: "undo", title: "Deshacer", source: "S-07", component: InboxUndoView, nav: "inbox" },
    { id: "process", title: "Procesar", source: "I-06", component: InboxProcessView, nav: false },
    { id: "processed", title: "Inbox procesado", source: "S-06", component: InboxProcessedView, nav: "inbox" },
  ],
};
