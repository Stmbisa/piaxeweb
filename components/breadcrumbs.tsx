"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    let label = segment.replace(/-/g, ' ')
    label = label.charAt(0).toUpperCase() + label.slice(1)

    // Special cases for better labels
    if (segment === 'auth') label = 'Authentication'
    if (segment === 'business-register') label = 'Business Registration'
    if (segment === 'developer-register') label = 'Developer Registration'
    if (segment === 'payment-links') label = 'Payment Links'

    breadcrumbs.push({
      label,
      href: currentPath
    })
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index === 0 && <Home className="w-4 h-4 mr-1" />}
            {index < breadcrumbs.length - 1 ? (
              <Link
                href={breadcrumb.href}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {breadcrumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
