import type { ReactNode } from "react"
import { Link } from "react-router"
import { RiSettings3Line } from "@remixicon/react"
import { IconButton } from "@/components/atoms/icon-button"
import { ScreenHeader } from "@/components/molecules/screen-header"

/** Cabecera de las pantallas de lista (Inbox, Proyectos, Tal vez): contador, título y acceso a Configuración. */
function ListHeader({ eyebrow, title }: { eyebrow: ReactNode; title: ReactNode }) {
  return (
    <ScreenHeader
      className="gap-4 pb-6"
      eyebrow={eyebrow}
      title={title}
      actions={
        <IconButton asChild aria-label="Configuración">
          <Link to="/settings">
            <RiSettings3Line aria-hidden />
          </Link>
        </IconButton>
      }
    />
  )
}

export { ListHeader }
