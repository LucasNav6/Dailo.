import type { ComponentType } from "react";
import type { MockupNav } from "@/components/layouts/mockup-frame";

export type { MockupNav };

/** Una pantalla del diseño en versión estática (mockup). */
export type MockupView = {
  /** Identificador estable dentro de su feature (nombre del archivo sin `.view.tsx`). */
  id: string;
  title: string;
  /** Código de la pantalla en el artifact de diseño (p. ej. "H-01"). */
  source: string;
  component: ComponentType;
  nav?: MockupNav;
  /** Alto del marco en px; 844 por defecto (iPhone). */
  height?: number;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  views: MockupView[];
};
