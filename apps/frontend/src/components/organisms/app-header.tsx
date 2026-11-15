import { Link } from "react-router"
import { RiMore2Fill } from "@remixicon/react"
import { Button } from "@/components/atoms/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/molecules/dropdown-menu"
import { ScreenHeader } from "@/components/molecules/screen-header"
import { secondaryNav } from "@/lib/navigation"

const dateFormatter = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "short" })

/** Cabecera de la app: fecha como eyebrow, título de la sección y menú de secundarios en móvil. */
function AppHeader({ title }: { title: string }) {
  return (
    <ScreenHeader
      eyebrow={dateFormatter.format(new Date()).replace(".", "")}
      title={title}
      actions={
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Más opciones" className="text-muted-foreground">
                <RiMore2Fill aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} collisionPadding={16}>
              {secondaryNav.map(({ to, label, Icon }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link to={to}>
                    <Icon aria-hidden />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    />
  )
}

export { AppHeader }
