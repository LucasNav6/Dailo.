import { RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/atoms/button";
import { DialogOverlay } from "@/components/layouts/overlay-layout";
import { SettingsScreen } from "@/components/layouts/settings-screen";

export function SettingsDeleteAllView() {
  return (
    <>
      <SettingsScreen title="Seguridad y datos" gap={6}>
        <section className="flex flex-col gap-3">
          <h3 className="text-[17px] font-semibold">Tus datos</h3>
          <div className="box-border rounded-2xl border border-border bg-surface p-4">
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-normal">
              <li>Tus datos se almacenan localmente en este dispositivo mediante IndexedDB.</li>
              <li>Actualmente no existe sincronización entre dispositivos.</li>
              <li>Borrar los datos del navegador puede eliminar la información almacenada.</li>
            </ul>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div>
            <h3 className="text-[17px] font-semibold">Eliminar datos locales</h3>
            <p className="mt-1 text-sm leading-normal text-muted-foreground">Borra de forma permanente tareas, proyectos, secciones y ajustes de este dispositivo.</p>
          </div>
          <Button variant="destructive" className="gap-2 [&_svg]:size-5">
            <RiDeleteBinLine aria-hidden />
            Eliminar todos los datos
          </Button>
        </section>
      </SettingsScreen>
      <DialogOverlay className="rounded-2xl">
        <h3 className="text-lg font-semibold">¿Eliminar todos los datos?</h3>
        <p className="text-sm leading-normal text-muted-foreground">
          Esta acción es irreversible. Se borrarán todos los datos locales de Dailo y los ajustes volverán a sus valores predeterminados.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" className="h-11 px-4">Cancelar</Button>
          <Button variant="destructive" className="h-11 px-4">Eliminar</Button>
        </div>
      </DialogOverlay>
    </>
  );
}
