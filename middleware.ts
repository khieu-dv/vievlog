
// Middleware để xác thực người dùng
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect các trang đã thay đổi hoặc không tồn tại
  const redirects: Record<string, string> = {
    '/games': '/games',
    '/profile/settings': '/profile',
    '/tutorials': '/docs',
    '/courses': '/docs',
    '/docs': '/docs'
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }
  
  // Kiểm tra nếu user đã đăng nhập, nếu chưa thì tạo một user ID ngẫu nhiên
  const userId = request.cookies.get('userId')?.value;
  const response = NextResponse.next();
  
  if (!userId) {
    const newUserId = Math.random().toString(36).substring(2, 15);
    response.cookies.set('userId', newUserId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};