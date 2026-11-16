import * as React from "react"
import { cn } from "@/shared/libs/utils"

const URL_PATTERN = /https?:\/\/[^\s]+/g
const TRAILING = /[.,;:!?)\]}'"»]+$/

export function hasLink(text: string) {
  return new RegExp(URL_PATTERN.source).test(text)
}

export function splitLinks(text: string): ({ text: string } | { url: string })[] {
  const parts: ({ text: string } | { url: string })[] = []
  let last = 0
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0
    const url = match[0].replace(TRAILING, "")
    if (start > last) parts.push({ text: text.slice(last, start) })
    parts.push({ url })
    last = start + url.length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer")
  return (
    <>
      {splitLinks(text).map((part, index) =>
        "url" in part ? (
          <span
            key={index}
            role="link"
            tabIndex={0}
            title={part.url}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              open(part.url)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                event.stopPropagation()
                open(part.url)
              }
            }}
            className={cn("cursor-pointer rounded-sm italic underline underline-offset-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", className)}
          >
            Enlace
          </span>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </>
  )
}

export { LinkifiedText }
