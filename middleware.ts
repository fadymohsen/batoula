import { auth } from "@/auth-edge";
import { NextResponse } from "next/server";
import { i18n } from "@/i18n/config";


export default auth((req) => {
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

  // Force Arabic as the default redirect for the root or any non-locale path
  return NextResponse.redirect(
    new URL(`/ar${pathname === "/" ? "" : pathname}`, req.url)
  );
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
