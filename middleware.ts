
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';
import { UserRole } from './types';

const PROTECTED_ROUTES = {
    '/admin': [UserRole.ADMIN],
    // Example for other roles:
    // '/waiter': [UserRole.WAITER, UserRole.ADMIN],
    // '/kitchen': [UserRole.KITCHEN, UserRole.ADMIN],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Determine if the current route is a protected route
    const protectedPath = Object.keys(PROTECTED_ROUTES).find(p => pathname.startsWith(p));
    
    if (!protectedPath) {
        return NextResponse.next();
    }
    
    // Prepare redirect URLs
    const loginUrl = new URL('/login', request.url); // Assuming a /login page will exist
    const forbiddenUrl = new URL('/forbidden', request.url); // Assuming a /forbidden page will exist

    // 1. Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(loginUrl);
    }

    // 2. Verify token
    try {
        const payload = await verifyJWT(token);
        if (!payload) {
             // Invalid token, redirect to login and clear the bad cookie
             const response = NextResponse.redirect(loginUrl);
             response.cookies.delete('token');
             return response;
        }

        // 3. Check role authorization
        const requiredRoles = PROTECTED_ROUTES[protectedPath as keyof typeof PROTECTED_ROUTES];
        const userRole = payload.role;

        if (!requiredRoles.includes(userRole)) {
            return NextResponse.redirect(forbiddenUrl);
        }

        // 4. If all checks pass, allow request to proceed
        return NextResponse.next();

    } catch (error) {
        console.error("Middleware verification error:", error);
        // Any other error, redirect to login and clear potentially corrupt cookie
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
  // Matcher to apply middleware to specific paths
  matcher: ['/admin/:path*'],
};
