import { useState, type FormEvent } from "react"
import { RiAlignLeft } from "@remixicon/react"
import { Button } from "@/components/atoms/button"
import { IconButton } from "@/components/atoms/icon-button"
import { InlineError } from "@/components/molecules/inline-error"
import { cn } from "@/lib/utils"

type ComposeFormProps = {
  placeholder: string;
  initialTitle?: string;
  initialDescription?: string;
  /** Devuelve un mensaje de error para mostrar en línea, o nada si se guardó. */
  onSave: (title: string, description: string) => Promise<string | void>;
  /** Máximo de caracteres de la descripción. */
  descriptionLimit?: number;
};

/** Formulario de captura real: campo principal de 22px, descripción opcional con contador y botón "Guardar". */
function ComposeForm({ placeholder, initialTitle = "", initialDescription = "", onSave, descriptionLimit = 250 }: ComposeFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [showDescription, setShowDescription] = useState(initialDescription.length > 0)
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const canSave = title.trim().length > 0 && !busy
  const atLimit = description.length >= descriptionLimit

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!canSave) return
    setBusy(true)
    setError(undefined)
    try {
      setError((await onSave(title.trim(), description.trim())) || undefined)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1">
      <input
        autoFocus
        aria-label={placeholder}
        placeholder={placeholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)
          setError(undefined)
        }}
        className="min-h-[52px] bg-transparent text-[22px] text-foreground caret-primary outline-none placeholder:text-muted-foreground"
      />
      {showDescription && (
        <div className="flex items-start gap-3.5 pt-1.5 pb-2.5">
          <span className="inline-flex pt-[3px] text-subtle [&_svg]:size-[22px]">
            <RiAlignLeft aria-hidden />
          </span>
          <textarea
            aria-label="Descripción"
            placeholder="Descripción"
            rows={3}
            maxLength={descriptionLimit}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="flex-1 resize-none bg-transparent text-[15px] leading-normal text-foreground caret-primary outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}
      {showDescription && atLimit && (
        <div className="flex justify-end pb-2">
          <span className="text-[13px] font-semibold text-danger-foreground">
            {description.length}/{descriptionLimit}
          </span>
        </div>
      )}
      {error && (
        <div className="mb-2">
          <InlineError>{error}</InlineError>
        </div>
      )}
      <div className="flex items-center gap-1.5 pt-3">
        <IconButton
          aria-label="Añadir descripción"
          aria-pressed={showDescription}
          type="button"
          onClick={() => setShowDescription((value) => !value)}
          className={showDescription ? "bg-selected text-foreground" : title ? "text-foreground" : "text-subtle"}
        >
          <RiAlignLeft aria-hidden />
        </IconButton>
        <span className="flex-1" />
        <Button type="submit" variant="ghost" disabled={!canSave} className={cn("h-11 px-2 disabled:opacity-100", canSave ? "text-foreground" : "text-faint")}>
          Guardar
        </Button>
      </div>
    </form>
  )
}

export { ComposeForm }
