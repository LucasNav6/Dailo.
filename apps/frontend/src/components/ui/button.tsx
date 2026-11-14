import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-transparent text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:border-brand",
        destructive: "border-destructive bg-destructive text-background hover:border-brand",
        outline: "border-input bg-field-bg hover:border-brand",
        secondary: "bg-secondary text-secondary-foreground hover:border-brand",
        ghost: "hover:bg-secondary",
        link: "rounded-none px-0 underline decoration-brand decoration-2 underline-offset-4",
      },
      size: {
        default: "h-12 px-5 has-[>svg]:px-4",
        xs: "h-8 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 px-6 text-base has-[>svg]:px-5",
        icon: "size-11",
        "icon-xs": "size-8 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
