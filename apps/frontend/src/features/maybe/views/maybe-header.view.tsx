import { Emphasis } from "@/shared/components/atoms/emphasis";
import { ListHeader } from "@/shared/components/molecules/list-header";

export function MaybeHeaderView({ eyebrow }: { eyebrow: string }) {
  return <ListHeader eyebrow={eyebrow} title={<>Para <Emphasis>después.</Emphasis></>} />;
}
