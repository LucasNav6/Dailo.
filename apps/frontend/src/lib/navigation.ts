import {
  RiLightbulbFill,
  RiLightbulbLine,
  RiSunFill,
  RiSunLine,
  RiDeleteBinFill,
  RiDeleteBinLine,
  RiFolderFill,
  RiFolderLine,
  RiInboxArchiveFill,
  RiInboxArchiveLine,
  RiSettings3Fill,
  RiSettings3Line,
  type RemixiconComponentType,
} from "@remixicon/react";

export type NavItem = {
  to: string;
  label: string;
  Icon: RemixiconComponentType;
  ActiveIcon: RemixiconComponentType;
};

export const primaryNav: NavItem[] = [
  { to: "/today", label: "Hoy", Icon: RiSunLine, ActiveIcon: RiSunFill },
  { to: "/inbox", label: "Inbox", Icon: RiInboxArchiveLine, ActiveIcon: RiInboxArchiveFill },
  { to: "/projects", label: "Proyectos", Icon: RiFolderLine, ActiveIcon: RiFolderFill },
  { to: "/someday", label: "Tal vez", Icon: RiLightbulbLine, ActiveIcon: RiLightbulbFill },
];

export const secondaryNav: NavItem[] = [
  { to: "/trash", label: "Descartados", Icon: RiDeleteBinLine, ActiveIcon: RiDeleteBinFill },
  { to: "/settings", label: "Configuración", Icon: RiSettings3Line, ActiveIcon: RiSettings3Fill },
];

export const allNav = [...primaryNav, ...secondaryNav];
