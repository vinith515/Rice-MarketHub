import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isConfigured =
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("your_supabase");

  if (!isConfigured) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const isLogin = request.nextUrl.pathname === "/admin/login";
      const demoAuth = request.cookies.get("demo_admin")?.value === "true";
      if (isLogin) {
        return NextResponse.redirect(new URL("/?admin=1", request.url));
      }
      if (!demoAuth) {
        return NextResponse.redirect(new URL("/?admin=1", request.url));
      }
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Parameters<typeof supabaseResponse.cookies.set>[2];
        }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const isLogin = request.nextUrl.pathname === "/admin/login";
    if (isLogin) {
      return NextResponse.redirect(new URL("/?admin=1", request.url));
    }
    if (!user) {
      return NextResponse.redirect(new URL("/?admin=1", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
