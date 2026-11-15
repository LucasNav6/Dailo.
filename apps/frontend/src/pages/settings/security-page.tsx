import { useState } from "react"
import { RiComputerLine, RiDeleteBinLine, RiInformationLine, RiSunCloudyLine } from "@remixicon/react"
import { deleteAllData } from "@/hooks/use-settings"
import { useTheme } from "@/lib/theme"
import { Button } from "@/components/atoms/button"
import { SettingsScreen } from "@/components/layouts/settings-screen"
import { ConfirmDialog } from "@/components/molecules/confirm-dialog"
import { SettingsSection } from "@/components/organisms/settings-section"

function Fact({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 py-1.5 text-sm leading-normal">
      <span className="inline-flex text-subtle [&_svg]:size-5">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

export function SecurityPage() {
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "deleted" | "error">("idle")

  const handleDelete = async () => {
    try {
      await deleteAllData()
      setTheme("system")
      setStatus("deleted")
    } catch {
      setStatus("error")
    }
    setOpen(false)
  }

  return (
    <SettingsScreen title="Seguridad y datos" gap={7} backTo="/settings">
      <SettingsSection title="Tus datos">
        <Fact icon={<RiComputerLine aria-hidden />}>Se guardan en este dispositivo, en IndexedDB.</Fact>
        <Fact icon={<RiSunCloudyLine aria-hidden />}>Por ahora no hay sincronización entre dispositivos.</Fact>
        <Fact icon={<RiInformationLine aria-hidden />}>Borrar los datos del navegador puede eliminar lo guardado.</Fact>
      </SettingsSection>
      <SettingsSection title="Eliminar datos locales" hint="Borra de forma permanente tareas, proyectos, secciones y ajustes de este dispositivo.">
        <button type="button" onClick={() => setOpen(true)} className="flex min-h-12 items-center gap-3.5 text-left text-[15px] font-semibold text-danger-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
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

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="¿Eliminar todos los datos?"
        description="Esta acción es irreversible. Se borrarán todos los datos locales de Dailo y los ajustes volverán a sus valores predeterminados."
      >
        <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
      </ConfirmDialog>
    </SettingsScreen>
  )
}
