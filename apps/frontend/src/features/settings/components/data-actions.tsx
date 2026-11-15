import type { ReactNode } from "react";
import { RiArchiveLine, RiDeleteBinLine, RiDownloadLine, RiUploadLine } from "@remixicon/react";
import { ListRow } from "@/components/molecules/list-row";
import { StorageMeter } from "@/components/molecules/storage-meter";

type DataActionsProps = {
  used: string;
  percent: number;
  critical?: boolean;
  exportSubtitle?: string;
  exportTrailing?: ReactNode;
};

export function DataActions({ used, percent, critical, exportSubtitle = "Un archivo con todos tus datos", exportTrailing }: DataActionsProps) {
  return (
    <>
      <StorageMeter used={used} total="300 MB" percent={percent} critical={critical} />
      <div className="flex flex-col">
        <ListRow icon={<RiDownloadLine aria-hidden />} title="Exportar copia" subtitle={exportSubtitle} trailing={exportTrailing} />
        <ListRow icon={<RiUploadLine aria-hidden />} title="Importar copia" subtitle="Agregar datos desde un archivo" />
        <ListRow icon={<RiArchiveLine aria-hidden />} title="Archivados" subtitle="2 proyectos" />
        <ListRow icon={<RiDeleteBinLine aria-hidden />} title="Eliminar todos los datos" subtitle="Borra todo de este dispositivo" danger />
      </div>
    </>
  );
}
