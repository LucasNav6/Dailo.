import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { RiCheckLine } from "@remixicon/react"
import { cn } from "@/shared/libs/utils"

function TaskCheck({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="task-check"
      className={cn(
        "grid size-[22px] shrink-0 place-items-center rounded-full border-2 border-subtle bg-transparent text-brand-foreground outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-brand data-[state=checked]:bg-brand disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center">
        <RiCheckLine className="size-3.5" aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { TaskCheck }
