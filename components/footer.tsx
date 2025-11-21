import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40" role="contentinfo">
      <div className="container py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Image src="/images/logo.png" alt="Piaxis - Secure Payments & Escrow Platform Logo" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-bold text-base sm:text-lg text-primary">Piaxis</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Secure payment system optimized for low trust environments.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Product</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="#consumers" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  For Consumers
                </Link>
              </li>
              <li>
                <Link href="#sme" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  For SMEs
                </Link>
              </li>
              <li>
                <Link href="#developers" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Support</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="#help" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#security" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm">© 2025 Piaxis. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link
              href="https://twitter.com/piaxis"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Follow piaxis on Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 sm:h-5 sm:h-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link
              href="https://linkedin.com/company/piaxis"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Follow piaxis on LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 sm:h-5 sm:h-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
