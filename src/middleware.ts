import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { i18n } from "@/i18n/config";

function getLocaleFromRequest(req: Request): string {
  const acceptLang = req.headers.get("accept-language") || "";
  const preferred = acceptLang.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (preferred && i18n.locales.includes(preferred as typeof i18n.locales[number])) {
    return preferred;
  }
  return i18n.defaultLocale;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // Normalize pathname to lowercase for checking
  const lowerPath = pathname.toLowerCase();

  // 1. Handle locale-prefixed admin paths (e.g., /ar/admin -> /admin)
  const localeAdminMatch = lowerPath.match(/^\/(ar|en)\/admin/);
  if (localeAdminMatch) {
    const newPath = pathname.replace(/^\/(ar|en)/i, "");
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  // 2. Skip locale logic for api, _next, static files, and admin
  if (
    lowerPath.startsWith("/api") ||
    lowerPath.startsWith("/_next") ||
    lowerPath.startsWith("/admin") ||
    pathname.includes(".") // static files
  ) {
    // Admin auth logic
    if (lowerPath.startsWith("/admin")) {
      const isLoggedIn = !!req.auth;
      const isLoginPage = lowerPath === "/admin/login";
      if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (!isLoginPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale-prefixed path
  const locale = getLocaleFromRequest(req);
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === "/" ? "" : pathname}`, req.url)
  );
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
