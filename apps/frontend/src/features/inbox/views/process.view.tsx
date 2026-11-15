import { RiCloseLine, RiDeleteBinLine, RiFolderLine, RiLightbulbLine } from "@remixicon/react";
import { IconButton } from "@/components/atoms/icon-button";
import { Progress } from "@/components/atoms/progress";
import { TileRow } from "@/components/molecules/tile-row";

/** Modo procesar: un elemento a la vez, con progreso y tres destinos. Sin barra inferior. */
export function InboxProcessView() {
  return (
    <>
      <div className="-mx-3 -mt-2 mb-1 flex items-center justify-between">
        <IconButton aria-label="Cerrar" className="text-foreground">
          <RiCloseLine aria-hidden />
        </IconButton>
        <span className="text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">Procesar · 1 de 4</span>
        <span className="w-11" />
      </div>
      <Progress value={25} className="h-1" aria-label="Progreso: 1 de 4" />
      <div className="mt-9 mb-7 flex flex-col gap-2.5">
        <h1 className="font-display text-[30px] leading-[1.12] font-semibold tracking-[-0.02em] text-foreground">Llamar al contador por el monotributo</h1>
        <span className="text-[15px] leading-normal text-muted-foreground">Preguntar por la categoría y el vencimiento de la cuota.</span>
      </div>
      <span className="mb-1 text-[13px] font-semibold tracking-[0.06em] text-subtle uppercase">¿Qué hacés con esto?</span>
      <TileRow icon={<RiFolderLine aria-hidden />}>Mover a un proyecto</TileRow>
      <TileRow icon={<RiLightbulbLine aria-hidden />}>Tal vez más adelante</TileRow>
      <TileRow icon={<RiDeleteBinLine aria-hidden />} tone="danger">Descartar</TileRow>
      <span className="mt-auto self-center p-3 text-[15px] font-semibold text-muted-foreground">Saltar por ahora</span>
    </>
  );
}
