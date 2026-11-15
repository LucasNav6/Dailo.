import type { Feature } from "../types";
import { SomedayAppView } from "./views/app.view";
import { SomedayEmptyView } from "./views/empty.view";
import { SomedayLoadingView } from "./views/loading.view";

export const somedayFeature: Feature = {
  id: "someday",
  name: "Tal vez",
  description: "Ideas sin compromiso: se planifican en un proyecto o se descartan, no se tachan.",
  views: [
    { id: "app", title: "Tal vez", source: "V-04", component: SomedayAppView, nav: "someday" },
    { id: "loading", title: "Tal vez cargando", source: "N-03", component: SomedayLoadingView, nav: "someday" },
    { id: "empty", title: "Tal vez vacío", source: "N-06", component: SomedayEmptyView, nav: "someday" },
  ],
};
