import { useState } from "react"
import { hasLink, LinkifiedText } from "@/shared/components/atoms/linkified-text"

type AutoFieldViewProps = {
  value: string
  onCommit: (value: string) => void
  label: string
  className: string
  placeholder?: string
}

export function AutoFieldView({ value, onCommit, label, className, placeholder }: AutoFieldViewProps) {
  const [draft, setDraft] = useState(value)
  const [editing, setEditing] = useState(false)

  if (!editing && hasLink(value)) {
    return (
      <div
        role="textbox"
        aria-label={label}
        tabIndex={0}
        onClick={() => setEditing(true)}
        onFocus={(event) => event.target === event.currentTarget && setEditing(true)}
        className={`w-full cursor-text whitespace-pre-wrap break-words outline-none ${className}`}
      >
        <LinkifiedText text={value} />
      </div>
    )
  }
  return (
    <textarea
      aria-label={label}
      placeholder={placeholder}
      rows={1}
      autoFocus={editing}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        setEditing(false)
        if (draft !== value) onCommit(draft)
      }}
      className={`field-sizing-content w-full resize-none bg-transparent outline-none placeholder:text-faint ${className}`}
    />
  )
}
