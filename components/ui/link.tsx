import * as React from "react"
import NextLink from "next/link"
import { cn } from "@/lib/utils"

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  className?: string
  children: React.ReactNode
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, className, children, ...props }, ref) => {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")

  if (isExternal) {
    return (
      <a ref={ref} href={href} className={cn(className)} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <NextLink ref={ref} href={href} className={cn(className)} {...props}>
      {children}
    </NextLink>
  )
})

Link.displayName = "Link"
