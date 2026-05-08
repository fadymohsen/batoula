"use client";

import { motion } from "framer-motion";
import { Heart, Zap } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

export default function Footer() {
  const { dict } = useLocale();

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.65 } },
  };

  return (
    <footer className="bg-charcoal text-white py-20 relative overflow-hidden">
      <div className="absolute top-0 end-0 w-80 h-80 bg-rose/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-64 h-64 bg-gold/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 start-1/4 w-32 h-32 bg-rose/5 rounded-full blur-[60px] pointer-events-none" />


      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-5">
          <h2 className="text-4xl lg:text-5xl font-black leading-tight">{dict.footer.cta}</h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            {dict.footer.ctaDescription}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col items-center gap-6">
          <a
            href="https://wa.me/"
            target="_blank"
            className="btn-shine px-12 py-6 rounded-full bg-rose text-white text-xl font-black hover:bg-rose-dark transition-all shadow-2xl shadow-rose/25 flex items-center gap-4"
          >
            {dict.footer.whatsapp}
            <Zap size={22} />
          </a>

          <div className="flex items-center gap-3">
            {[
              { label: "Instagram", href: "https://www.instagram.com/batool.home?igsh=MXhnY3R5eDh0d20wcQ==", vb: "0 0 24 24", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
              { label: "Facebook", href: "https://www.facebook.com/share/1HAy8RGqgV/", vb: "0 0 24 24", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { label: "TikTok", href: "https://www.tiktok.com/@batool_home?_r=1&_t=ZN-95w9fa2xqyZ", vb: "0 0 24 24", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" },
              { label: "YouTube", href: "https://youtube.com/@batoolhome6303?si=1u2ZLkH4PhLCTd30", vb: "0 0 24 24", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              { label: "Snapchat", href: "https://www.snapchat.com/add/batool4alahmad?share_id=EwcBnH-cwIM&locale=ar-AE", vb: "0 0 24 24", path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301a.32.32 0 0 1 .114-.027.35.35 0 0 1 .209.056c.264.182.13.58.085.681a51.535 51.535 0 0 1-.065.14c-.218.427-.345.6-.345.894 0 .494.456.838 1.142 1.298.089.06.178.117.264.177.967.667 1.08 1.457 1.016 1.745a.67.67 0 0 1-.657.475c-.174 0-.353-.025-.53-.074a3.697 3.697 0 0 0-.862-.13c-.26 0-.469.032-.652.107a2.26 2.26 0 0 0-.387.257c-.534.425-1.194.957-2.862 1.082-.18.014-.344.134-.396.31-.137.468-.422 1.003-.932 1.48-.894.836-2.091 1.27-3.558 1.27h-.146c-1.467 0-2.664-.434-3.558-1.27-.51-.477-.795-1.012-.932-1.48a.464.464 0 0 0-.396-.31c-1.668-.125-2.328-.657-2.862-1.082a2.26 2.26 0 0 0-.387-.257 1.531 1.531 0 0 0-.652-.107c-.305 0-.605.044-.862.13a1.688 1.688 0 0 1-.53.074.67.67 0 0 1-.657-.475c-.064-.288.049-1.078 1.016-1.745.086-.06.175-.118.264-.177.686-.46 1.142-.804 1.142-1.298 0-.294-.127-.467-.345-.894a2.478 2.478 0 0 1-.065-.14c-.045-.101-.179-.5.085-.681A.35.35 0 0 1 3.562 9.7a.32.32 0 0 1 .114.027c.374.181.733.317 1.033.301.198 0 .326-.045.401-.09a31.08 31.08 0 0 1-.033-.57c-.104-1.628-.23-3.654.3-4.847C6.94 1.069 10.296.793 11.286.793h.92z" },
            ].map(({ label, href, vb, path }) => (
              <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-rose/30 transition-colors">
                <svg viewBox={vb} fill="currentColor" className="w-5 h-5"><path d={path}/></svg>
              </a>
            ))}

          </div>
        </motion.div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} {dict.footer.copyright}</p>
          <div className="flex items-center gap-2">
            <span>{dict.footer.madeWith}</span>
            <motion.span
              initial={{ scale: 1 }}
              whileInView={{ scale: [1, 1.5, 1, 1.3, 1] }}
              transition={{ duration: 0.75, delay: 0.4 }}
              viewport={{ once: true }}
              className="inline-flex"
            >
              <Heart size={14} className="text-rose fill-rose" />
            </motion.span>
          </div>
          <a href="https://veliq.co" target="_blank" rel="noopener" className="text-white/30 hover:text-white/60 transition-colors">
            Powered by <span className="font-semibold">VELIQ</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
