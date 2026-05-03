import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 推廣連結追蹤：讀取 ?ref= 參數
  const ref = searchParams.get('ref')
  if (ref && /^[A-Z0-9]{6,12}$/.test(ref)) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('ref')
    const response = NextResponse.redirect(url)

    response.cookies.set('affiliate_ref', ref, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    // 非同步記錄點擊（不阻塞）
    const origin = request.nextUrl.origin
    const productSlug = pathname.match(/\/product\/([^/]+)/)?.[1]
    fetch(`${origin}/api/track/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref,
        productSlug,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      }),
    }).catch(() => {})

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
