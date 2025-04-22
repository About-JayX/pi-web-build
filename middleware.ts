import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 将/home重定向到/（这是为了处理可能已经存在的/home链接）
  if (pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// 配置匹配的路径
export const config = {
  matcher: ['/home'],
} 