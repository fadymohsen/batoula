import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { FramerProviders } from "@/components/FramerProviders";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coach-batoula.vercel.app"), // Replace with actual production URL when ready
  title: "كوتش بتولة | Coach Batoula",

  description:
    "كوتش بتولة - كوتش تغذية معتمدة ومدربة حياة. ابدأي رحلتك نحو نمط حياة صحي مع كوتش بتولة.",
  icons: {
    icon: "/og-image.jpg",
    apple: "/og-image.jpg",
  },
  openGraph: {
    title: "كوتش بتولة | Coach Batoula",
    description:
      "كوتش بتولة - كوتش تغذية معتمدة ومدربة حياة. ابدأي رحلتك نحو نمط حياة صحي مع كوتش بتولة.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 1200, alt: "كوتش بتولة" }],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "كوتش بتولة | Coach Batoula",
    description:
      "كوتش بتولة - كوتش تغذية معتمدة ومدربة حياة. ابدأي رحلتك نحو نمط حياة صحي مع كوتش بتولة.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)]">
        {/* reducedMotion="user" respects system prefers-reduced-motion */}
        <FramerProviders>{children}</FramerProviders>
      </body>
    </html>
  );
}
