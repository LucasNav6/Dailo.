import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";
import { PageColumn } from "@/components/layouts/page-column";

/** Pantalla pendiente de construir: cabecera del diseño y aviso. */
export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <PageColumn>
      <ListHeader eyebrow={title} title={<Emphasis>{title}</Emphasis>} />
      <p className="text-base leading-normal text-muted-foreground">{description}</p>
    </PageColumn>
  );
}
