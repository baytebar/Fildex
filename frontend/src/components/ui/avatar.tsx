"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  variant?: "default" | "gradient" | "outline" | "solid"
  size?: "sm" | "default" | "lg" | "xl"
}) {
  const sizeClasses = {
    sm: "size-6",
    default: "size-8", 
    lg: "size-10",
    xl: "size-12"
  }

  const variantClasses = {
    default: "rounded-full",
    gradient: "rounded-full bg-gradient-to-br from-blue-500 to-purple-600",
    outline: "rounded-full border-2 border-primary",
    solid: "rounded-full bg-primary"
  }

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  variant?: "default" | "gradient" | "outline" | "solid"
}) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    gradient: "bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold",
    outline: "bg-background text-primary border-2 border-primary font-semibold",
    solid: "bg-primary text-primary-foreground font-semibold"
  }

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-sm font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
