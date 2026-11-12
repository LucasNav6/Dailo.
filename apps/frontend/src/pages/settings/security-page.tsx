import { useState } from "react"
import { RiDatabase2Line, RiDeleteBinLine } from "@remixicon/react"
import { deleteAllData } from "@/hooks/use-settings"
import { useTheme } from "@/lib/theme"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Panel, Section } from "./settings-ui"

export function SecurityPage() {
  const { setTheme } = useTheme()
  const [status, setStatus] = useState<"idle" | "deleted" | "error">("idle")

  const handleDelete = async () => {
    try {
      await deleteAllData()
      setTheme("system")
      setStatus("deleted")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div>
      <Section title="Tus datos" Icon={RiDatabase2Line}>
        <Panel>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>Tus datos se almacenan localmente en este dispositivo mediante IndexedDB.</li>
          <li>Actualmente no existe sincronización entre dispositivos.</li>
          <li>Borrar los datos del navegador puede eliminar la información almacenada.</li>
        </ul>
        </Panel>
      </Section>

      <Section title="Eliminar datos locales" description="Borra de forma permanente tareas, proyectos, secciones y ajustes de este dispositivo.">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="h-12 w-full">
              <RiDeleteBinLine aria-hidden />
              Eliminar todos los datos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar todos los datos?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción es irreversible. Se borrarán todos los datos locales de Dailo y los ajustes volverán a sus valores predeterminados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p role="status" className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          {status === "deleted" && "Los datos se eliminaron y los ajustes se restauraron."}
          {status === "error" && "No se pudieron eliminar los datos. Inténtalo de nuevo."}
        </p>
      </Section>
    </div>
  )
}
