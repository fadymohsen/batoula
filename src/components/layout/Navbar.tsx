"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-2 inset-x-0 z-50 glass mx-auto max-w-[95%] rounded-full shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-rose">
              <Image src="/coach-batoula-logo.jpg" alt="كوتش بتولة" fill className="object-cover" />
            </div>
            <span className="text-xl font-black text-charcoal">كوتش بتولة</span>
          </Link>

          <div className="hidden lg:flex items-center gap-9 text-sm font-bold text-charcoal/65">
            {[["/#about","قصتي"],["/plans","الباقات"],["/#certs","شهاداتي"],["/#faq","الأسئلة"]].map(([href,label]) => (
              <Link key={href} href={href} className="relative group py-1">
                {label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-rose scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/"
              target="_blank"
              className="btn-shine hidden sm:flex bg-charcoal text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-charcoal-dark transition-all shadow-md items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/50 focus-visible:ring-offset-2"
            >
              <Phone size={15} />
              احجزي الآن
            </a>
            <button
              onClick={() => setNavOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-charcoal/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
              aria-label="القائمة"
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
              className="absolute top-6 ms-6 w-11 h-11 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
              style={{ left: "auto", right: "1.5rem" }}
              aria-label="إغلاق القائمة"
            >
              <X size={20} className="text-charcoal" />
            </button>
            {[["/#about","قصتي"],["/plans","الباقات"],["/#certs","شهاداتي"],["/#faq","الأسئلة"]].map(([href,label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setNavOpen(false)}
                className="text-3xl font-black text-charcoal hover:text-rose transition-colors"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/"
              onClick={() => setNavOpen(false)}
              className="mt-4 flex items-center gap-3 bg-rose text-white px-10 py-4 rounded-full text-lg font-black shadow-xl shadow-rose/20"
            >
              <Phone size={20} />
              احجزي الآن
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
