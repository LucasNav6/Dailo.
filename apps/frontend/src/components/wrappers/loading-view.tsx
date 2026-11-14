/**
 * Vista de carga. Los datos son locales (IndexedDB) y llegan al instante, así que
 * no hay spinner: solo un aviso para lectores de pantalla.
 */
export function LoadingView({ label = "Cargando…" }: { label?: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}
