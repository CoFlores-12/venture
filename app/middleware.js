import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    // Skip middleware for admin login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session');
    
    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Validate admin session
      const sessionData = JSON.parse(adminSession.value);
      
      if (!sessionData.isAdmin || sessionData.role !== 'admin') {
        // Invalid admin session, redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Check if session is expired (7 days)
      const loginTime = new Date(sessionData.loginTime);
      const now = new Date();
      const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 7) {
        // Session expired, redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

    } catch (error) {
      // Invalid session data, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 