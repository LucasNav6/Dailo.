import type { ReactNode } from "react"
import { RiComputerLine, RiDeleteBinLine, RiInformationLine, RiSunCloudyLine } from "@remixicon/react"
import { SettingsScreen } from "@/shared/components/layouts/settings-screen"
import { SettingsSection } from "@/shared/components/organisms/settings-section"
import type { DeleteAllStatus } from "../hooks/delete-all-data.hook"

function Fact({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 py-1.5 text-sm leading-normal">
      <span className="inline-flex text-subtle [&_svg]:size-5">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

type SecurityViewProps = {
  status: DeleteAllStatus
  onDelete: () => void
}

export function SecurityView({ status, onDelete }: SecurityViewProps) {
  return (
    <SettingsScreen title="Seguridad y datos" gap={7} backTo="/settings">
      <SettingsSection title="Tus datos">
        <Fact icon={<RiComputerLine aria-hidden />}>Se guardan en este dispositivo, en IndexedDB.</Fact>
        <Fact icon={<RiSunCloudyLine aria-hidden />}>Por ahora no hay sincronización entre dispositivos.</Fact>
        <Fact icon={<RiInformationLine aria-hidden />}>Borrar los datos del navegador puede eliminar lo guardado.</Fact>
      </SettingsSection>
      <SettingsSection title="Eliminar datos locales" hint="Borra de forma permanente tareas, proyectos, secciones y ajustes de este dispositivo.">
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-12 items-center gap-3.5 text-left text-[15px] font-semibold text-danger-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="inline-flex w-6 justify-center text-danger [&_svg]:size-[22px]">
            <RiDeleteBinLine aria-hidden />
          </span>
          Eliminar todos los datos
        </button>
        <p role="status" className={status === "error" ? "text-sm text-danger-foreground" : "text-sm text-muted-foreground"}>
          {status === "deleted" && "Los datos se eliminaron y los ajustes se restauraron."}
          {status === "error" && "No se pudieron eliminar los datos. Inténtalo de nuevo."}
        </p>
      </SettingsSection>
    </SettingsScreen>
  )
}
