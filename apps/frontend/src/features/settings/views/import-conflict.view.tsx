import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { Switch } from "@/components/atoms/switch";
import { BackBar } from "@/components/molecules/back-bar";
import { ConflictOption } from "@/components/molecules/conflict-option";

/** Resolver un conflicto de importación: conservar el actual, el importado o ambos. */
export function SettingsImportConflictView() {
  return (
    <>
      <BackBar title="Conflicto 1 de 3" backLabel="Volver a Configuración" />
      <h1 className="mt-2 mb-1 font-display text-[28px] leading-[1.12] font-semibold tracking-[-0.02em]">
        Ya existe el proyecto <Emphasis>Casa.</Emphasis>
      </h1>
      <p className="text-sm leading-normal text-muted-foreground">Mismo proyecto con contenido distinto.</p>
      <div className="mt-2">
        <ConflictOption label="Actual" title="Casa · 6 tareas" detail="Modificado hoy 09:40" selected />
        <ConflictOption label="Importado" title="Casa · 9 tareas" detail="Modificado el 10 nov" />
        <ConflictOption label="Conservar ambos" title="Importado como “Casa (2)”" detail="Los dos quedan en tu lista" />
      </div>
      <div className="mt-2 flex min-h-[52px] items-center gap-3">
        <span className="flex-1 text-[15px]">Aplicar a los 3 conflictos</span>
        <Switch aria-label="Aplicar a los 3 conflictos" />
      </div>
      <div className="mt-auto flex items-center justify-between">
        <Button variant="ghost" className="h-11 px-2 text-danger-foreground">Cancelar importación</Button>
        <Button>Siguiente</Button>
      </div>
    </>
  );
}
