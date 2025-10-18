"use client"

import { forwardRef } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AccessibleButtonProps extends ButtonProps {
  /** Описание для screen readers */
  ariaDescription?: string
  /** Показывать ли focus ring */
  showFocusRing?: boolean
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, ariaDescription, showFocusRing = true, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "touch-manipulation min-h-[44px] min-w-[44px]",
          showFocusRing && "focus-visible:outline-2 focus-visible:outline-[#10a37f] focus-visible:outline-offset-2",
          className
        )}
        aria-describedby={ariaDescription ? `${props.id || 'button'}-description` : undefined}
        {...props}
      >
        {children}
        {ariaDescription && (
          <span id={`${props.id || 'button'}-description`} className="sr-only">
            {ariaDescription}
          </span>
        )}
      </Button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"
