import { Button } from "@/components/atoms/button";
import { Emphasis } from "@/components/atoms/emphasis";
import { ErrorLayout } from "@/components/layouts/error-layout";

/** Error de lectura: los datos siguen en el dispositivo; se ofrece reintentar o exportar una copia. */
export function GeneralErrorView() {
  return (
    <ErrorLayout
      title={<>No pudimos <Emphasis>cargar tus datos.</Emphasis></>}
      description="Tus datos siguen en este dispositivo. Probá de nuevo. Si el problema sigue, exportá una copia antes de hacer cambios."
      secondaryAction={<Button variant="ghost" className="h-11 px-2">Exportar una copia</Button>}
    />
  );
}
