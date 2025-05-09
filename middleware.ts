
// Middleware để xác thực người dùng
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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
  matcher: ['/chat/:path*'],
};