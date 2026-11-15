import { SettingsScreen } from "@/components/layouts/settings-screen";
import { ArchivedList } from "../components/archived-list";
import { ARCHIVED } from "../data";

/** Proyectos archivados, con restaurar y eliminar. */
export function SettingsArchivedView() {
  return (
    <SettingsScreen title="Archivados">
      <p className="text-sm leading-normal text-muted-foreground">
        Los proyectos archivados no aparecen en Hoy ni en Proyectos. Restauralos cuando los necesites.
      </p>
      <ArchivedList projects={ARCHIVED} />
    </SettingsScreen>
  );
}
