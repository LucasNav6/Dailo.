import type { Feature } from "../types";
import { SettingsArchivedEmptyView } from "./views/archived-empty.view";
import { SettingsArchivedView } from "./views/archived.view";
import { SettingsDeleteAllView } from "./views/delete-all.view";
import { SettingsExportDoneView } from "./views/export-done.view";
import { SettingsExportErrorView } from "./views/export-error.view";
import { SettingsExportProgressView } from "./views/export-progress.view";
import { SettingsImportConflictView } from "./views/import-conflict.view";
import { SettingsImportInvalidView } from "./views/import-invalid.view";
import { SettingsImportSummaryView } from "./views/import-summary.view";
import { SettingsIndexView } from "./views/index.view";
import { SettingsNoPersistenceView } from "./views/no-persistence.view";
import { SettingsNotificationsView } from "./views/notifications.view";
import { SettingsPreferencesView } from "./views/preferences.view";
import { SettingsRestoreConflictView } from "./views/restore-conflict.view";
import { SettingsScopeOptionsView } from "./views/scope-options.view";
import { SettingsScopeRenameErrorView } from "./views/scope-rename-error.view";
import { SettingsScopesView } from "./views/scopes.view";
import { SettingsSecurityView } from "./views/security.view";
import { SettingsStorageAlmostFullView } from "./views/storage-almost-full.view";

export const settingsFeature: Feature = {
  id: "settings",
  name: "Configuración",
  description: "Preferencias, ámbitos de la vida, archivados y todo lo local: exportar, importar, espacio y borrado.",
  views: [
    { id: "index", title: "Configuración", source: "V-06", component: SettingsIndexView, nav: "none" },
    { id: "preferences", title: "Preferencias", source: "V-07", component: SettingsPreferencesView, nav: "none", height: 900 },
    { id: "notifications", title: "Notificaciones", source: "V-08", component: SettingsNotificationsView, nav: "none" },
    { id: "scopes", title: "Ámbitos de la vida", source: "V-06b", component: SettingsScopesView, nav: "none" },
    { id: "scope-options", title: "Opciones de ámbito", source: "D-07", component: SettingsScopeOptionsView, nav: "none" },
    { id: "scope-rename-error", title: "Renombrar ámbito con error", source: "D-08", component: SettingsScopeRenameErrorView, nav: "none" },
    { id: "archived", title: "Archivados", source: "Z-01", component: SettingsArchivedView, nav: "none" },
    { id: "archived-empty", title: "Archivados vacío", source: "Z-02", component: SettingsArchivedEmptyView, nav: "none" },
    { id: "restore-conflict", title: "Restaurar con nombre repetido", source: "Z-03", component: SettingsRestoreConflictView, nav: "none" },
    { id: "security", title: "Seguridad y datos", source: "V-09", component: SettingsSecurityView, nav: "none" },
    { id: "export-progress", title: "Exportar: progreso", source: "Z-07", component: SettingsExportProgressView, nav: "none" },
    { id: "export-done", title: "Exportar: listo", source: "Z-08", component: SettingsExportDoneView, nav: "none" },
    { id: "export-error", title: "Exportar: error", source: "Z-09", component: SettingsExportErrorView, nav: "none" },
    { id: "no-persistence", title: "Datos sin persistencia", source: "Z-10", component: SettingsNoPersistenceView, nav: "none" },
    { id: "storage-almost-full", title: "Espacio casi lleno", source: "Z-11", component: SettingsStorageAlmostFullView, nav: "none" },
    { id: "import-summary", title: "Importar: resumen", source: "Z-04", component: SettingsImportSummaryView, nav: "none" },
    { id: "import-conflict", title: "Importar: conflicto", source: "Z-05", component: SettingsImportConflictView, nav: "none" },
    { id: "import-invalid", title: "Importar: archivo inválido", source: "Z-06", component: SettingsImportInvalidView, nav: "none" },
    { id: "delete-all", title: "Eliminar todos los datos", source: "V-10", component: SettingsDeleteAllView, nav: "none" },
  ],
};
