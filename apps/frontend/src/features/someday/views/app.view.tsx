import { IdeaList } from "../components/idea-list";
import { SomedayHeader } from "../components/someday-header";
import { IDEAS } from "../data";

/** Tal vez con cuatro ideas guardadas. */
export function SomedayAppView() {
  return (
    <>
      <SomedayHeader eyebrow={`Tal vez · ${IDEAS.length} ideas`} />
      <IdeaList />
    </>
  );
}
