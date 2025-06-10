"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/auth/context"
import { Menu, X, User, LogOut, Building2, Store } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, isDeveloper, isBusiness, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2" aria-label="Piaxe Home">
            <Image src="/images/logo.png" alt="Piaxe Logo" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" priority />
            <span className="font-bold text-lg sm:text-xl text-primary">Piaxe</span>
          </Link>
          <nav className="hidden md:flex gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/#consumers"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Learn about Piaxe for consumers"
            >
              Consumers
            </Link>
            <Link
              href="/#sme"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Learn about Piaxe for SMEs"
            >
              SMEs
            </Link>
            <Link
              href="/#developers"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Explore Piaxe API for developers"
            >
              API
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="About Piaxe"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                    {(isDeveloper || isBusiness) ? <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs sm:text-sm font-medium leading-none">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      {isDeveloper && user?.developer_profile && (
                        <p className="text-xs leading-none text-muted-foreground font-medium">
                          Developer: {user.developer_profile.developer_name}
                        </p>
                      )}
                      {isBusiness && user?.business_profile && (
                        <p className="text-xs leading-none text-muted-foreground font-medium">
                          Business: {user.business_profile.business_name}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Regular user options */}
                  <DropdownMenuItem asChild className="text-xs sm:text-sm">
                    <Link href="/dashboard">
                      <User className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Personal Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* Developer options */}
                  {isDeveloper && (
                    <DropdownMenuItem asChild className="text-xs sm:text-sm">
                      <Link href="/developer/dashboard">
                        <Building2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Developer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Business options */}
                  {isBusiness && (
                    <DropdownMenuItem asChild className="text-xs sm:text-sm">
                      <Link href="/business/dashboard">
                        <Store className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Business Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Options to create accounts if not already created */}
                  {!isDeveloper && !isBusiness && (
                    <>
                      <DropdownMenuItem asChild className="text-xs sm:text-sm">
                        <Link href="/auth/developer-register">
                          <Building2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Create Developer Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-xs sm:text-sm">
                        <Link href="/auth/business-register">
                          <Store className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Create Business Account
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Allow creating additional account type if only have one */}
                  {isDeveloper && !isBusiness && (
                    <DropdownMenuItem asChild className="text-xs sm:text-sm">
                      <Link href="/auth/business-register">
                        <Store className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Create Business Account
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isBusiness && !isDeveloper && (
                    <DropdownMenuItem asChild className="text-xs sm:text-sm">
                      <Link href="/auth/developer-register">
                        <Building2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Create Developer Account
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="text-xs sm:text-sm">
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-xs sm:text-sm">
                    <LogOut className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t" role="navigation" aria-label="Mobile navigation">
          <div className="container py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
            <Link
              href="/#consumers"
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-accent rounded-md text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Consumers
            </Link>
            <Link href="/#sme" className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-accent rounded-md text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              SMEs
            </Link>
            <Link
              href="/#developers"
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-accent rounded-md text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              API
            </Link>
            <Link href="/#about" className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-accent rounded-md text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">Personal Dashboard</Link>
                  </Button>
                  {isDeveloper && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/developer/dashboard">Developer Dashboard</Link>
                    </Button>
                  )}
                  {isBusiness && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/business/dashboard">Business Dashboard</Link>
                    </Button>
                  )}
                  {!isDeveloper && !isBusiness && (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth/developer-register">Create Developer Account</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth/business-register">Create Business Account</Link>
                      </Button>
                    </>
                  )}
                  {isDeveloper && !isBusiness && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/business-register">Create Business Account</Link>
                    </Button>
                  )}
                  {isBusiness && !isDeveloper && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/developer-register">Create Developer Account</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
