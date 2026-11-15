import { Emphasis } from "@/components/atoms/emphasis";
import { ListHeader } from "@/components/molecules/list-header";

export function SomedayHeader({ eyebrow }: { eyebrow: string }) {
  return <ListHeader eyebrow={eyebrow} title={<>Para <Emphasis>después.</Emphasis></>} />;
}
