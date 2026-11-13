import { cn } from "@/lib/utils";

type Props = {
  /** Mensaje del error; sin mensaje no se ve nada. */
  message?: string | null;
  className?: string;
};

/**
 * Mensaje de error accesible. El nodo existe siempre (vacío y oculto) para que los
 * lectores de pantalla anuncien el texto cuando aparece.
 */
export function ErrorView({ message, className }: Props) {
  return (
    <p role="alert" className={cn("text-sm text-destructive empty:hidden", className)}>
      {message || null}
    </p>
  );
}
