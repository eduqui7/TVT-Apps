import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://platform.twitter.com"
  )

  return response
}

export const config = {
  matcher: '/:path*',
}
