import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Normalize host: redirect www to apex domain for canonical consistency
  // const host = request.headers.get('host') || ''
  // if (host.startsWith('www.')) {
  //   const url = request.nextUrl.clone()
  //   url.host = host.replace(/^www\./, '')
  //   return NextResponse.redirect(url, 308)
  // }
  // Get the pathname of the request (e.g. /, /dashboard, /about, etc.)


  // Host canonicalization removed.
  // Previous logic redirected www -> apex while Vercel (domain settings) redirected apex -> www,
  // creating an infinite redirect loop (ERR_TOO_MANY_REDIRECTS).
  // Decide on ONE place for canonical redirects (either platform config OR middleware) — not both.
  // !!!!! If we later want to enforce a single host, reintroduce logic that matches the platform direction only.
  // Get the pathname of the request (e.g. /, /dashboard, /about, etc.)
  const path = request.nextUrl.pathname

  // Expose admin UI under /admin/* while keeping the internal security prefix folder.
  // /admin/...  ->  /a8f6ae9d/admin/...
  const adminPrefix = process.env.NEXT_PUBLIC_ADMIN_PREFIX || "a8f6ae9d";
  if (path === "/admin" || path.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${adminPrefix}${path}`;
    return NextResponse.rewrite(url);
  }

  // Define paths that require authentication
  const protectedPaths = ['/dashboard']

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath =>
    path.startsWith(protectedPath)
  )

  if (isProtectedPath) {
    // Check for auth token in cookies
    const token = request.cookies.get('piaxis_auth_token')?.value

    if (!token) {
      // Redirect to login with a return URL
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('returnUrl', path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images|icons|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
