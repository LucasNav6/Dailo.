import { RiAddLine, RiAlbumLine, RiCalendarLine, RiFolderLine, RiStarLine } from "@remixicon/react";
import { Chip } from "@/components/atoms/chip";
import { Switch } from "@/components/atoms/switch";
import { AttachmentRow } from "@/components/molecules/attachment-row";
import { CountHeading } from "@/components/molecules/count-heading";
import { DetailBar } from "@/components/molecules/detail-bar";
import { InlineAction } from "@/components/molecules/inline-action";
import { PropertyRow } from "@/components/molecules/property-row";
import { SubtaskRow } from "@/components/molecules/subtask-row";

/** Detalle de una tarea: proyecto, plan, fecha límite, subtareas y adjuntos. Sin barra inferior. */
export function ProjectsTaskDetailView() {
  return (
    <>
      <DetailBar />
      <Chip className="h-8 gap-1.5 self-start px-3 text-[13px] [&_svg]:size-4">
        <RiFolderLine aria-hidden />
        Rediseño del sitio
      </Chip>
      <h1 className="mt-3.5 mb-2 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-foreground">Escribir los textos de la home</h1>
      <p className="text-[15px] leading-normal text-muted-foreground">
        Hero, “Sobre nosotros”, llamado a la acción y preguntas frecuentes. Tono cercano, sin tecnicismos.
      </p>
      <div className="mt-5 flex flex-col">
        <PropertyRow icon={<RiCalendarLine aria-hidden />} label="Planificada">
          <Chip>Mañana · 10:00</Chip>
        </PropertyRow>
        <PropertyRow icon={<RiStarLine aria-hidden />} label="Esencial ese día">
          <Switch checked aria-label="Esencial ese día" />
        </PropertyRow>
        <PropertyRow icon={<RiAlbumLine aria-hidden />} label="Fecha límite">
          <Chip>Vie 21 nov</Chip>
        </PropertyRow>
      </div>
      <CountHeading label="Subtareas" count="2/4" />
      <ul className="flex flex-col">
        <SubtaskRow title="Título y subtítulo del hero" checked className="pl-[5px]" />
        <SubtaskRow title="Sección “Sobre nosotros”" checked className="pl-[5px]" />
        <SubtaskRow title="Llamado a la acción" className="pl-[5px]" />
        <SubtaskRow title="Preguntas frecuentes" className="pl-[5px]" />
      </ul>
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]">Añadir subtarea</InlineAction>
      <CountHeading label="Adjuntos" count={2} />
      <AttachmentRow name="brief-textos.pdf" status={{ kind: "size", text: "240 KB" }} />
      <AttachmentRow name="referencias.png" status={{ kind: "size", text: "1,2 MB" }} />
      <InlineAction icon={<RiAddLine aria-hidden />} className="mt-0 gap-[13px] [&_svg]:size-[18px]">Adjuntar archivo</InlineAction>
    </>
  );
}
