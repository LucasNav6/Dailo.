import { RiAddLine, RiFolderLine } from "@remixicon/react";
import { Chip } from "@/components/atoms/chip";
import { AttachmentRow } from "@/components/molecules/attachment-row";
import { CountHeading } from "@/components/molecules/count-heading";
import { DetailBar } from "@/components/molecules/detail-bar";
import { InlineAction } from "@/components/molecules/inline-action";
import { InlineError } from "@/components/molecules/inline-error";

export function ProjectsAttachmentStatesView() {
  return (
    <>
      <DetailBar />
      <Chip className="h-8 gap-1.5 self-start px-3 text-[13px] [&_svg]:size-4">
        <RiFolderLine aria-hidden />
        Rediseño del sitio
      </Chip>
      <h1 className="mt-3.5 font-display text-[28px] leading-[1.15] font-semibold text-foreground">Escribir los textos de la home</h1>
      <CountHeading label="Adjuntos" count={3} />
      <AttachmentRow variant="stacked" name="brief-textos.pdf" status={{ kind: "size", text: "240 KB" }} />
      <AttachmentRow variant="stacked" name="referencias.png" status={{ kind: "uploading", progress: 55, text: "Guardando… 55 %" }} />
      <AttachmentRow variant="stacked" name="demo.mov" status={{ kind: "error", text: "Supera el límite de 25 MB" }} />
      <InlineAction icon={<RiAddLine aria-hidden />}>Adjuntar archivo</InlineAction>
      <div className="mt-3">
        <InlineError>1 archivo no se pudo guardar.</InlineError>
      </div>
    </>
  );
}
