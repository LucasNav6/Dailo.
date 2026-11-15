import type { ComponentType } from "react";
import type { MockupNav } from "@/components/layouts/mockup-frame";

export type { MockupNav };

export type MockupView = {
  id: string;
  title: string;
  source: string;
  component: ComponentType;
  nav?: MockupNav;
  height?: number;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  views: MockupView[];
};
