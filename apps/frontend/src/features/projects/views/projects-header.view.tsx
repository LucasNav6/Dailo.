import { Emphasis } from "@/shared/components/atoms/emphasis";
import { ListHeader } from "@/shared/components/molecules/list-header";

export function ProjectsHeaderView({ count }: { count?: number }) {
  return <ListHeader eyebrow={count === undefined ? "Proyectos" : `Proyectos · ${count}`} title={<>Tus <Emphasis>proyectos.</Emphasis></>} />;
}
