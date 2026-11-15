import type { Feature } from "./types";
import { generalFeature } from "./general";
import { inboxFeature } from "./inbox";
import { projectsFeature } from "./projects";
import { settingsFeature } from "./settings";
import { somedayFeature } from "./someday";
import { todayFeature } from "./today";

/** Todas las features con sus vistas estáticas, en el orden del diseño. */
export const features: Feature[] = [todayFeature, inboxFeature, projectsFeature, somedayFeature, settingsFeature, generalFeature];
