import { RiAddLine } from "@remixicon/react";
import { InlineAction } from "@/components/molecules/inline-action";

/** "＋ Añadir tarea" alineado con las filas de tarea. */
export function AddTask({ onClick }: { onClick?: () => void }) {
  return <InlineAction icon={<RiAddLine aria-hidden />} onClick={onClick}>Añadir tarea</InlineAction>;
}
