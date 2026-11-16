import { Emphasis } from "@/shared/components/atoms/emphasis";
import { ListHeader } from "@/shared/components/molecules/list-header";
import { PageColumn } from "@/shared/components/layouts/page-column";

export function PagePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <PageColumn>
      <ListHeader eyebrow={title} title={<Emphasis>{title}</Emphasis>} />
      <p className="text-base leading-normal text-muted-foreground">{description}</p>
    </PageColumn>
  );
}
