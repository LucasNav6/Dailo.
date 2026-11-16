import { NavLink } from "react-router"
import type { RemixiconComponentType } from "@remixicon/react"
import { cn } from "@/shared/libs/utils"

type NavItemProps = {
  to: string;
  label: string;
  Icon: RemixiconComponentType;
  ActiveIcon: RemixiconComponentType;
  active?: boolean;
};

const linkClass = "group flex flex-col items-center gap-1 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

function NavItemBody({ label, Icon, ActiveIcon, isActive }: Pick<NavItemProps, "label" | "Icon" | "ActiveIcon"> & { isActive: boolean }) {
  return (
    <>
      <span
        className={cn(
          "grid h-8 w-14 place-items-center rounded-full border-2 transition-colors",
          isActive ? "border-selected-border bg-selected text-foreground" : "border-transparent bg-transparent text-muted-foreground group-hover:text-foreground"
        )}
      >
        {isActive ? <ActiveIcon className="size-[22px]" aria-hidden /> : <Icon className="size-[22px]" aria-hidden />}
      </span>
      <span className={cn("text-xs", isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>{label}</span>
    </>
  )
}

function NavItem({ to, label, Icon, ActiveIcon, active }: NavItemProps) {
  if (active !== undefined) {
    return (
      <a href={to} aria-current={active ? "page" : undefined} className={linkClass}>
        <NavItemBody label={label} Icon={Icon} ActiveIcon={ActiveIcon} isActive={active} />
      </a>
    )
  }
  return (
    <NavLink to={to} className={linkClass}>
      {({ isActive }) => <NavItemBody label={label} Icon={Icon} ActiveIcon={ActiveIcon} isActive={isActive} />}
    </NavLink>
  )
}

export { NavItem }
