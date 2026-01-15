import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Role-Based Protection
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (path.startsWith('/faculty') && token?.role !== 'FACULTY') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (path.startsWith('/student') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      // This ensures the middleware function above only runs if 'authorized' is true
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/faculty/:path*',
    '/student/:path*',
    '/attendance/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
  ],
};
