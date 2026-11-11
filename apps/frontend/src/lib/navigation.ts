import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiCalendarCheckFill,
  RiCalendarCheckLine,
    RiDeleteBinFill,
  RiDeleteBinLine,
  RiFolderFill,
  RiFolderLine,
  RiInboxFill,
  RiInboxLine,
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
  { to: "/today", label: "Hoy", Icon: RiCalendarCheckLine, ActiveIcon: RiCalendarCheckFill },
  { to: "/inbox", label: "Inbox", Icon: RiInboxLine, ActiveIcon: RiInboxFill },
  { to: "/projects", label: "Proyectos", Icon: RiFolderLine, ActiveIcon: RiFolderFill },
  { to: "/someday", label: "Tal vez", Icon: RiBookmarkLine, ActiveIcon: RiBookmarkFill },
];

export const secondaryNav: NavItem[] = [
  { to: "/trash", label: "Descartados", Icon: RiDeleteBinLine, ActiveIcon: RiDeleteBinFill },
  { to: "/settings", label: "Configuración", Icon: RiSettings3Line, ActiveIcon: RiSettings3Fill },
];

export const allNav = [...primaryNav, ...secondaryNav];
