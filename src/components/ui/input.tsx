import * as React from "react"
import { cn } from "@/lib/utils"

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-background/60 px-3 py-1 text-base md:text-sm shadow-xs outline-none transition-all duration-200 ease-out",
        "placeholder:text-muted-foreground/70 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // focus
        "focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
        // invalid
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/40",
        // glass nuance
        "backdrop-blur-sm dark:bg-input/30 hover:bg-input/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
