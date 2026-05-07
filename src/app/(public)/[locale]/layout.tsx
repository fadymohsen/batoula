import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "../../globals.css";
import { FramerProviders } from "@/components/FramerProviders";
import { i18n, isRtl, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LocaleProvider } from "@/i18n/LocaleContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    metadataBase: new URL("https://coach-batoula.vercel.app"),
    title: {
      default: dict.meta.title,
      template: `%s | ${dict.nav.brand}`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    authors: [{ name: dict.nav.brand }],
    creator: dict.nav.brand,
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 1200, alt: dict.nav.brand }],
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
      siteName: dict.nav.brand,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const rtl = isRtl(locale as Locale);
  const fontVar = locale === "ar" ? cairo.variable : `${cairo.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"} className={`${fontVar} h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${locale === "ar" ? "font-[family-name:var(--font-cairo)]" : "font-[family-name:var(--font-inter)]"}`}>
        <FramerProviders>
          <LocaleProvider locale={locale as Locale} dict={dict}>
            {children}
          </LocaleProvider>
        </FramerProviders>
      </body>
    </html>
  );
}
