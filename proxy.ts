import { auth } from "@/auth-edge";
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

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // 1. Handle locale-prefixed admin paths
  const localeAdminMatch = lowerPath.match(/^\/(ar|en)\/admin/);
  if (localeAdminMatch) {
    const newPath = pathname.replace(/^\/(ar|en)/i, "");
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  // 2. Skip logic for api, _next, static, and admin login
  if (
    lowerPath.startsWith("/api") ||
    lowerPath.startsWith("/_next") ||
    lowerPath === "/admin/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Admin protection
  if (lowerPath.startsWith("/admin")) {
    const isLoggedIn = !!req.auth;
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // 4. Locale redirection for public pages
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocaleFromRequest(req);
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === "/" ? "" : pathname}`, req.url)
  );
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
