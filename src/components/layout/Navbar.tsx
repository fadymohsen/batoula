"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Globe } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const { locale, dict } = useLocale();
  const pathname = usePathname();

  const switchLocale = locale === "ar" ? "en" : "ar";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  const navLinks = [
    [`/${locale}/#about`, dict.nav.myStory],
    [`/${locale}/plans`, dict.nav.plans],
    [`/${locale}/#certs`, dict.nav.certificates],
    [`/${locale}/#faq`, dict.nav.faq],
  ];

  return (
    <>
      <nav className="fixed top-2 inset-x-0 z-50 glass mx-auto max-w-[95%] rounded-full shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-rose">
              <Image src="/coach-batoula-logo.jpg" alt={dict.nav.brand} fill className="object-cover" />
            </div>
            <span className="text-xl font-black text-charcoal">{dict.nav.brand}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-9 text-sm font-bold text-charcoal/65">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={href} className="relative group py-1">
                {label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={switchPath}
              className="flex items-center gap-1.5 text-sm font-bold text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <Globe size={15} />
              <span className="hidden sm:inline">{dict.langSwitch}</span>
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              className="btn-shine hidden sm:flex bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-charcoal-dark transition-all shadow-md items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/50 focus-visible:ring-offset-2"
            >
              <Phone size={15} />
              {dict.nav.bookNow}
            </a>
            <button
              onClick={() => setNavOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-charcoal/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
              aria-label={dict.nav.menu}
            >
              <Menu size={22} className="text-charcoal" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            className="fixed inset-0 z-[150] bg-white flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setNavOpen(false)}
              className="absolute top-6 w-11 h-11 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
              style={{ left: locale === "ar" ? "auto" : "1.5rem", right: locale === "ar" ? "1.5rem" : "auto" }}
              aria-label={dict.nav.closeMenu}
            >
              <X size={20} className="text-charcoal" />
            </button>
            {navLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setNavOpen(false)}
                className="text-3xl font-black text-charcoal hover:text-rose transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href={switchPath}
              onClick={() => setNavOpen(false)}
              className="flex items-center gap-2 text-xl font-bold text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <Globe size={20} />
              {dict.langSwitch}
            </Link>
            <a
              href="https://wa.me/"
              onClick={() => setNavOpen(false)}
              className="mt-4 flex items-center gap-3 bg-rose text-white px-10 py-4 rounded-full text-lg font-black shadow-xl shadow-rose/20"
            >
              <Phone size={20} />
              {dict.nav.bookNow}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
