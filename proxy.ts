import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Skip Supabase auth if env vars are placeholder
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect app routes — redirect to /join if not authenticated
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith('/discover') ||
    pathname.startsWith('/matches') ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/me');

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/join';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
