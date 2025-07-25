// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Redirigir solicitudes de recursos estáticos incorrectos
  if (request.nextUrl.pathname.startsWith('/rovimusic/')) {
    const newUrl = new URL(
      request.nextUrl.pathname.replace('/rovimusic/', '/erp/'),
      request.nextUrl
    );
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/rovimusic/:path*',
};