import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

<<<<<<< HEAD
export function middleware(req: NextRequest) {
  const token = req.cookies.get('access');

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
=======
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access');

  if (!accessToken) {
    const signInUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signInUrl);
>>>>>>> 703ccaf (feat: Add middleware to protect dashboard routes)
  }

  return NextResponse.next();
}

export const config = {
<<<<<<< HEAD
  matcher: '/admin/:path*',
=======
  matcher: '/dashboard/:path*',
>>>>>>> 703ccaf (feat: Add middleware to protect dashboard routes)
};
