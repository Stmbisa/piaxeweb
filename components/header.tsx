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
  const { user, isAuthenticated, isMerchant, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Piaxe Home">
            <Image src="/images/logo.png" alt="Piaxe Logo" width={32} height={32} className="w-8 h-8" priority />
            <span className="font-bold text-xl text-primary">Piaxe</span>
          </Link>
          <nav className="hidden md:flex gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="#consumers"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Learn about Piaxe for consumers"
            >
              Consumers
            </Link>
            <Link
              href="#sme"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Learn about Piaxe for SMEs"
            >
              SMEs
            </Link>
            <Link
              href="#developers"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Explore Piaxe API for developers"
            >
              API
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="About Piaxe"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    {isMerchant ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      {isMerchant && user?.merchant_profile && (
                        <p className="text-xs leading-none text-muted-foreground font-medium">
                          {user.merchant_profile.business_name}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Regular user options */}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Personal Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {/* Merchant options */}
                  {isMerchant && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/store">
                          <Store className="mr-2 h-4 w-4" />
                          Store Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/developers">
                          <Building2 className="mr-2 h-4 w-4" />
                          Developer Portal
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Option to create merchant account if not a merchant */}
                  {!isMerchant && (
                    <DropdownMenuItem asChild>
                      <Link href="/auth/merchant-register">
                        <Building2 className="mr-2 h-4 w-4" />
                        Create Business Account
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
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
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="#consumers"
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Consumers
            </Link>
            <Link href="#sme" className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setIsMenuOpen(false)}>
              SMEs
            </Link>
            <Link
              href="#developers"
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              API
            </Link>
            <Link href="#about" className="px-4 py-2 hover:bg-accent rounded-md" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">Personal Dashboard</Link>
                  </Button>
                  {isMerchant && (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard/store">Store Dashboard</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/developers">Developer Portal</Link>
                      </Button>
                    </>
                  )}
                  {!isMerchant && (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/merchant-register">Create Business Account</Link>
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
