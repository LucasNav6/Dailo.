import type { Feature } from "../types";
import { TodayAppView } from "./views/app.view";
import { TodayEmptyView } from "./views/empty.view";
import { TodayAchievedView } from "./views/achieved.view";
import { TodayCompletedUndoView } from "./views/completed-undo.view";
import { TodayEssentialsDoneView } from "./views/essentials-done.view";
import { TodayEssentialsFullView } from "./views/essentials-full.view";
import { TodayLoadingView } from "./views/loading.view";
import { TodayLongTextView } from "./views/long-text.view";
import { TodayMonthView } from "./views/month.view";
import { TodayOtherDayEmptyView } from "./views/other-day-empty.view";
import { TodayOtherDayView } from "./views/other-day.view";
import { TodayOverdueView } from "./views/overdue.view";

export const todayFeature: Feature = {
  id: "today",
  name: "Hoy",
  description: "El foco es el día actual, con un vistazo a los días que vienen: esenciales, franjas y atrasadas.",
  views: [
    { id: "app", title: "Hoy", source: "H-01", component: TodayAppView, nav: "today" },
    { id: "empty", title: "Hoy vacío", source: "H-02", component: TodayEmptyView, nav: "today" },
    { id: "loading", title: "Hoy cargando", source: "S-01", component: TodayLoadingView, nav: "today" },
    { id: "other-day", title: "Otro día", source: "H-03", component: TodayOtherDayView, nav: "today" },
    { id: "other-day-empty", title: "Otro día vacío", source: "N-05", component: TodayOtherDayEmptyView, nav: "today" },
    { id: "overdue", title: "Atrasadas", source: "S-02", component: TodayOverdueView, nav: "today" },
    { id: "month", title: "Vistazo al mes", source: "H-04", component: TodayMonthView, nav: "today" },
    { id: "essentials-done", title: "Esenciales listos", source: "H-05", component: TodayEssentialsDoneView, nav: "today" },
    { id: "completed-undo", title: "Completadas y deshacer", source: "H-06", component: TodayCompletedUndoView, nav: "today" },
    { id: "achieved", title: "Lo lograste", source: "H-07", component: TodayAchievedView, nav: "today" },
    { id: "essentials-full", title: "Esenciales lleno", source: "D-03", component: TodayEssentialsFullView, nav: "today" },
    { id: "long-text", title: "Textos largos", source: "D-06", component: TodayLongTextView, nav: "today" },
  ],
};
