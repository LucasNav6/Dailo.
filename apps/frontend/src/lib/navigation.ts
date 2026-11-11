import {
    RiDeleteBinFill,
  RiDeleteBinLine,
  RiFolderFill,
  RiFolderLine,
  RiHourglassFill,
  RiHourglassLine,
  RiInboxFill,
  RiInboxLine,
  RiSettings3Fill,
  RiSettings3Line,
  RiSunFill,
  RiSunLine,
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
  { to: "/inbox", label: "Inbox", Icon: RiInboxLine, ActiveIcon: RiInboxFill },
  { to: "/projects", label: "Proyectos", Icon: RiFolderLine, ActiveIcon: RiFolderFill },
  { to: "/someday", label: "Tal vez", Icon: RiHourglassLine, ActiveIcon: RiHourglassFill },
];

export const secondaryNav: NavItem[] = [
  { to: "/trash", label: "Descartados", Icon: RiDeleteBinLine, ActiveIcon: RiDeleteBinFill },
  { to: "/settings", label: "Configuración", Icon: RiSettings3Line, ActiveIcon: RiSettings3Fill },
];

export const allNav = [...primaryNav, ...secondaryNav];
