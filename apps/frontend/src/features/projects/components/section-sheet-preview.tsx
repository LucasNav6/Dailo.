import { Caret } from "@/components/atoms/caret";
import { InlineError } from "@/components/molecules/inline-error";
import { SheetOverlay } from "@/components/layouts/overlay-layout";
import { cn } from "@/lib/utils";

type SectionSheetPreviewProps = {
  value?: string;
  placeholder?: string;
  caretAfterValue?: boolean;
  error?: string;
  canSave: boolean;
  note?: string;
};

export function SectionSheetPreview({ value, placeholder = "Nombre de la sección", caretAfterValue, error, canSave, note = "En Rediseño del sitio" }: SectionSheetPreviewProps) {
  return (
    <SheetOverlay className="gap-4 pb-6" handleClassName="mb-0">
      <div className="flex flex-col gap-1">
        <div className="flex min-h-[52px] items-center">
          {value ? (
            <>
              <span className="text-[22px] text-foreground">{value}</span>
              {caretAfterValue !== false && <Caret className="ml-0.5 h-7" />}
            </>
          ) : (
            <>
              <Caret className="mr-[3px] h-7" />
              <span className="text-[22px] text-muted-foreground">{placeholder}</span>
            </>
          )}
        </div>
        {error && (
          <div className="mb-2">
            <InlineError>{error}</InlineError>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="pl-0.5 text-[13px] text-muted-foreground">{note}</span>
          <span className={cn("inline-flex h-11 items-center px-2 text-[15px] font-semibold", canSave ? "text-foreground" : "text-faint")}>Guardar</span>
        </div>
      </div>
    </SheetOverlay>
  );
}
