import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";

export function ProjectsHeader({ count }: { count?: number }) {
  return <ListHeader eyebrow={count === undefined ? "Proyectos" : `Proyectos · ${count}`} title={<>Tus <Emphasis>proyectos.</Emphasis></>} />;
}
