import type { Feature } from "../types";
import { GeneralErrorView } from "./views/error.view";
import { GeneralUpdateBannerView } from "./views/update-banner.view";

export const generalFeature: Feature = {
  id: "general",
  name: "General",
  description: "Errores y avisos que no pertenecen a una sola pantalla.",
  views: [
    { id: "error", title: "Error de lectura", source: "N-04", component: GeneralErrorView, nav: "none" },
    { id: "update-banner", title: "Actualización disponible", source: "D-05", component: GeneralUpdateBannerView, nav: "today" },
  ],
};
