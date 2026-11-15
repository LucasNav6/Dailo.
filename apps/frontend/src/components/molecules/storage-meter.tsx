import { Progress } from "@/components/atoms/progress"

/** Medidor de espacio usado: etiqueta, cifra en negrita y barra de 6px; `critical` la pinta en rojo fuerte. */
function StorageMeter({ used, total, percent, critical = false }: { used: string; total: string; percent: number; critical?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Espacio usado</span>
        <span className="font-semibold text-foreground">
          {used} de {total}
        </span>
      </div>
      <Progress value={percent} className="h-1.5" indicatorClassName={critical ? "bg-danger" : undefined} aria-label="Espacio usado" />
    </div>
  )
}

export { StorageMeter }
