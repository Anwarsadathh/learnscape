// middleware.ts (place in root of frontend folder)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] Processing: ${pathname}`);

  // Get backend URL - expecting it to end with /api
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://learnscapeedu.com/api';
  // Remove /api suffix for base URL operations
  const backendRoot = backendBaseUrl.replace(/\/api$/, '');

  // === MAINTENANCE MODE CHECK ===
  // Skip maintenance check for these paths
  const maintenanceExcludedPaths = [
    '/maintenance',
    '/admin',
    '/api/admin',
    '/_next',
    '/favicon.ico'
  ];

  const shouldCheckMaintenance = !maintenanceExcludedPaths.some(path => pathname.startsWith(path));

  if (shouldCheckMaintenance) {
    try {
      // For API routes, proxy to backend
      if (pathname.startsWith('/api/')) {
        // When proxying API calls, use the root URL + pathname (which already includes /api)
        const proxyUrl = `${backendRoot}${pathname}${request.nextUrl.search}`;
        console.log(`[Middleware] Proxying API call to: ${proxyUrl}`);
        
        const response = await fetch(proxyUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        });

        console.log(`[Middleware] Backend response status: ${response.status}`);

        // If backend returns 503 (maintenance mode)
        if (response.status === 503) {
          console.log(`[Middleware] API route ${pathname} blocked by maintenance mode`);
          
          // For JSON requests, return JSON response
          if (request.headers.get('accept')?.includes('application/json')) {
            return new NextResponse(
              JSON.stringify({ 
                success: false,
                maintenanceMode: true, 
                message: 'Service under maintenance' 
              }),
              { 
                status: 503, 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          }
          
          // For page requests, redirect to maintenance page
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }

        // Return the backend response for non-maintenance responses
        return new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }

      // For non-API routes, check maintenance status
      // Use the full API URL from env variable for this specific endpoint
      const maintenanceCheckUrl = `${backendBaseUrl}/admin/settings/maintenance`;
      console.log(`[Middleware] Checking maintenance status at: ${maintenanceCheckUrl}`);
      
      const maintenanceCheck = await fetch(maintenanceCheckUrl);
      
      if (maintenanceCheck.ok) {
        const data = await maintenanceCheck.json();
        console.log(`[Middleware] Maintenance mode status: ${data.maintenanceMode}`);
        
        if (data.maintenanceMode === true) {
          console.log(`[Middleware] Redirecting ${pathname} to maintenance page`);
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
      } else {
        console.log(`[Middleware] Maintenance check failed with status: ${maintenanceCheck.status}`);
      }
    } catch (error) {
      console.error('[Middleware] Maintenance check error:', error);
      // Continue on error - fail open rather than blocking the site
    }
  }

  // === ADMIN AUTHENTICATION CHECK ===
  // Public admin pages that don't require authentication
  const publicAdminPages = ['/admin/login'];
  
  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('adminToken');
    
    console.log(`[Middleware] Admin route detected: ${pathname}`);
    console.log(`[Middleware] Token present: ${!!token}`);
    
    // Allow access to login page
    if (publicAdminPages.includes(pathname)) {
      // If already logged in and trying to access login, redirect to dashboard
      if (token) {
        console.log('[Middleware] Already logged in, redirecting to dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }
    
    // Protect other admin pages
    if (!token) {
      console.log('[Middleware] No token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    console.log('[Middleware] Token valid, allowing access');
  }

  // === CONSULTANT AUTHENTICATION CHECK (Future Implementation) ===
  // Add consultant authentication logic here when needed
  if (pathname.startsWith('/consultant')) {
    const consultantToken = request.cookies.get('consultantToken');
    const publicConsultantPages = ['/consultant/login', '/consultant/register'];
    
    if (publicConsultantPages.includes(pathname)) {
      if (consultantToken) {
        return NextResponse.redirect(new URL('/consultant/dashboard', request.url));
      }
      return NextResponse.next();
    }
    
    if (!consultantToken) {
      console.log('[Middleware] No consultant token, redirecting to login');
      return NextResponse.redirect(new URL('/consultant/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files) 
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ]
};