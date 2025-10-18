"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  interactive,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { interactive?: boolean }) {
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
    >
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full border border-border/40 bg-card/50 backdrop-blur-sm",
          interactive && "cursor-pointer hover:shadow-md hover:shadow-primary/10 transition-all",
          className
        )}
        {...props}
      />
    </motion.div>
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="size-full"
    >
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        onLoad={() => setLoaded(true)}
        className={cn("aspect-square size-full object-cover", className)}
        {...props}
      />
    </motion.div>
  )
}

function AvatarFallback({
  name,
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { name?: string }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AI"

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-muted text-foreground font-semibold select-none",
        className
      )}
      {...props}
    >
      {initials}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
