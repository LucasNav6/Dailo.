import { useState, type FormEvent } from "react";
import { RiAddLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  placeholder: string;
  onAdd: (title: string) => Promise<unknown>;
  className?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
};

/** Campo para agregar un elemento con Enter. Ante un error conserva el texto. */
export function InlineAdd({ placeholder, onAdd, className, autoFocus, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [failed, setFailed] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      await onAdd(title);
      setTitle("");
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };

  return (
    <form onSubmit={submit} className={cn("flex min-h-11 items-center gap-3 rounded-sm px-2 text-muted-foreground focus-within:bg-muted hover:bg-muted/60", className)}>
      <RiAddLine className="size-5 shrink-0" aria-hidden />
      <input
        value={title}
        autoFocus={autoFocus}
        onChange={(event) => {
          setTitle(event.target.value);
          setFailed(false);
        }}
        onKeyDown={(event) => event.key === "Escape" && onCancel?.()}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-invalid={failed}
        enterKeyHint="done"
        className="h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {failed && <span role="alert" className="text-xs text-destructive">No se pudo guardar</span>}
    </form>
  );
}
