import { RiAlignLeft, RiFolderLine } from "@remixicon/react"
import { Button } from "@/components/atoms/button"
import { Caret } from "@/components/atoms/caret"
import { Chip } from "@/components/atoms/chip"
import { IconButton } from "@/components/atoms/icon-button"
import { InlineError } from "@/components/molecules/inline-error"
import { SheetOverlay } from "@/components/layouts/overlay-layout"
import { cn } from "@/lib/utils"

type ComposeSheetProps = {
  placeholder: string;
  value?: string;
  caretAfterValue?: boolean;
  description?: string;
  scope?: string;
  error?: string;
  counter?: string;
  canSave: boolean;
};

function ComposeSheet({ placeholder, value, caretAfterValue, description, scope, error, counter, canSave }: ComposeSheetProps) {
  const hasDescription = description !== undefined
  return (
    <SheetOverlay className="gap-4 pb-6" handleClassName="mb-0">
      <div className="flex flex-col gap-1">
        <div className="flex min-h-[52px] items-center">
          {value ? (
            <>
              <span className="text-[22px] text-foreground">{value}</span>
              {caretAfterValue && <Caret className="ml-0.5 h-7" />}
            </>
          ) : (
            <>
              <Caret className="mr-[3px] h-7" />
              <span className="text-[22px] text-muted-foreground">{placeholder}</span>
            </>
          )}
        </div>
        {hasDescription && (
          <div className={cn("flex items-start gap-3.5 pt-1.5", counter ? "pb-0.5" : "pb-2.5")}>
            <span className="inline-flex pt-[3px] text-subtle [&_svg]:size-[22px]">
              <RiAlignLeft aria-hidden />
            </span>
            <span className="flex-1 text-[15px] leading-normal text-foreground">
              {description}
              <Caret className="ml-px h-[18px] align-text-bottom" />
            </span>
          </div>
        )}
        {counter && (
          <div className="flex justify-end pb-2">
            <span className="text-[13px] font-semibold text-danger-foreground">{counter}</span>
          </div>
        )}
        {error && (
          <div className="mb-2">
            <InlineError>{error}</InlineError>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <IconButton
            aria-label="Añadir descripción"
            className={hasDescription ? "bg-selected text-foreground" : value ? "text-foreground" : "text-subtle"}
          >
            <RiAlignLeft aria-hidden />
          </IconButton>
          {scope && (
            <Chip className="gap-1.5 [&_svg]:size-[18px]">
              <RiFolderLine aria-hidden />
              {scope}
            </Chip>
          )}
          <span className="flex-1" />
          <Button variant="ghost" className={cn("h-11 px-2", canSave ? "text-foreground" : "text-faint")}>
            Guardar
          </Button>
        </div>
      </div>
    </SheetOverlay>
  )
}

export { ComposeSheet }
