import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Use 'export default' to ensure Next.js detects the entry point correctly
export default function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // 2. Define protected routes and their required roles
  const routePermissions = {
    '/admin': ['ADMIN'],
    '/kitchen': ['KITCHEN', 'ADMIN'],
    '/waiter': ['WAITER', 'ADMIN'],
  }

  // 3. Helper to check if path matches a protected route
  const getRequiredRoles = (path: string) => {
    if (path.startsWith('/admin')) return routePermissions['/admin']
    if (path.startsWith('/kitchen')) return routePermissions['/kitchen']
    if (path.startsWith('/waiter')) return routePermissions['/waiter']
    return null
  }

  const requiredRoles = getRequiredRoles(pathname)

  // 4. Handle Protected Routes
  if (requiredRoles) {
    if (!token) {
      // If user is not logged in, redirect to login page
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Decode token to check role
    try {
      const payload = parseJwt(token) as { role: string }
      const userRole = payload.role?.toUpperCase()

      if (!requiredRoles.includes(userRole)) {
        // Redirect to unauthorized page or back to their home
        // For simplicity, redirect to their main hub or root
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (e) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 5. Handle Login Route (Prevent logged-in users from seeing login page)
  if (pathname === '/login' && token) {
    try {
      const payload = parseJwt(token) as { role: string }
      const userRole = payload.role?.toUpperCase()

      let redirectUrl = '/guest'
      if (userRole === 'ADMIN') redirectUrl = '/admin/tables'
      if (userRole === 'WAITER') redirectUrl = '/waiter'
      if (userRole === 'KITCHEN') redirectUrl = '/kitchen'

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (e) {
      // Ignore invalid token here, just let them login
    }
  }

  return NextResponse.next()
}

// Simple JWT parser for Edge Runtime
function parseJwt(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}

// Configure which paths the middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svgs, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
}