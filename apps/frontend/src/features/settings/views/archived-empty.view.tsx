import { RiArchiveLine } from "@remixicon/react";
import { Emphasis } from "@/components/atoms/emphasis";
import { SettingsScreen } from "@/components/layouts/settings-screen";
import { EmptyState } from "@/components/molecules/empty-state";

export function SettingsArchivedEmptyView() {
  return (
    <SettingsScreen title="Archivados" gap={0}>
      <EmptyState
        icon={<RiArchiveLine aria-hidden />}
        title={<>Nada <Emphasis>archivado.</Emphasis></>}
        description="Cuando archives un proyecto, lo vas a encontrar acá."
        descriptionClassName="max-w-[310px]"
      />
    </SettingsScreen>
  );
}
