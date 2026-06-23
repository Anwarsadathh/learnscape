import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  console.log(`[Middleware] Processing: ${pathname}`)

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  const backendRoot = backendBaseUrl.replace(/\/api$/, '')

  // === API PROXY FIRST ===
  // Important: handle all /api/* routes here before any maintenance or auth page logic.
  if (pathname.startsWith('/api/')) {
    try {
      const proxyUrl = `${backendRoot}${pathname}${search}`
      console.log(`[Middleware] Proxying API call to: ${proxyUrl}`)

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('host', new URL(backendRoot).host)

      const isBodyMethod =
        request.method !== 'GET' && request.method !== 'HEAD'

      const response = await fetch(
        proxyUrl,
        {
          method: request.method,
          headers: requestHeaders,
          body: isBodyMethod ? request.body : undefined,
          ...(isBodyMethod ? ({ duplex: 'half' } as any) : {}),
        } as RequestInit
      )

      console.log(`[Middleware] Backend response status: ${response.status}`)

      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    } catch (error) {
      console.error('[Middleware] API proxy error:', error)

      return NextResponse.json(
        {
          success: false,
          message: 'API proxy failed',
        },
        { status: 502 }
      )
    }
  }

  // === MAINTENANCE MODE CHECK ===
  // Skip maintenance check for admin pages and framework/static routes.
  const maintenanceExcludedPaths = [
    '/maintenance',
    '/admin',
    '/_next',
    '/favicon.ico',
  ]

  const shouldCheckMaintenance = !maintenanceExcludedPaths.some((path) =>
    pathname.startsWith(path)
  )

  if (shouldCheckMaintenance) {
    try {
      const maintenanceCheckUrl = `${backendBaseUrl}/admin/settings/maintenance`
      console.log(
        `[Middleware] Checking maintenance status at: ${maintenanceCheckUrl}`
      )

      const maintenanceCheck = await fetch(maintenanceCheckUrl, {
        cache: 'no-store',
      })

      if (maintenanceCheck.ok) {
        const data = await maintenanceCheck.json()
        console.log(
          `[Middleware] Maintenance mode status: ${data.maintenanceMode}`
        )

        if (data.maintenanceMode === true) {
          console.log(
            `[Middleware] Redirecting ${pathname} to maintenance page`
          )
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      } else {
        console.log(
          `[Middleware] Maintenance check failed with status: ${maintenanceCheck.status}`
        )
      }
    } catch (error) {
      console.error('[Middleware] Maintenance check error:', error)
      // fail open
    }
  }

  // === ADMIN AUTHENTICATION CHECK ===
  const publicAdminPages = ['/admin/login']

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('adminToken')

    console.log(`[Middleware] Admin route detected: ${pathname}`)
    console.log(`[Middleware] Token present: ${!!token}`)

    if (publicAdminPages.includes(pathname)) {
      if (token) {
        console.log(
          '[Middleware] Already logged in, redirecting to dashboard'
        )
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }

      return NextResponse.next()
    }

    if (!token) {
      console.log('[Middleware] No token, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    console.log('[Middleware] Token valid, allowing access')
  }

  // === CONSULTANT AUTHENTICATION CHECK ===
  const publicConsultantPages = ['/consultant/login', '/consultant/register']

  if (pathname.startsWith('/consultant')) {
    const consultantToken = request.cookies.get('consultantToken')

    if (publicConsultantPages.includes(pathname)) {
      if (consultantToken) {
        return NextResponse.redirect(
          new URL('/consultant/dashboard', request.url)
        )
      }

      return NextResponse.next()
    }

    if (!consultantToken) {
      console.log('[Middleware] No consultant token, redirecting to login')
      return NextResponse.redirect(
        new URL('/consultant/login', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}