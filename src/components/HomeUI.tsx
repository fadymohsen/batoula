"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  Heart, Star, ShieldCheck, Zap, CheckCircle2, ArrowRight, Smartphone, Globe,
  ChevronDown, BookOpen, Award, GraduationCap, TrendingDown, ChevronLeft, ChevronRight,
  Coffee, Apple, Clock,
} from "lucide-react";
import { getContent } from "@/lib/cms";
import { useLocale } from "@/i18n/LocaleContext";

/* ─────────────────────────────────────────────────────────────
   Helper components
───────────────────────────────────────────────────────────── */

function AnimatedCounter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

function Wave({ bg, fill }: { bg: string; fill: string }) {
  return (
    <div style={{ background: bg }}>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full block" style={{ height: 56, display: "block" }}>
        <path fill={fill} d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65 } },
};
const staggerGrid = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.5 } },
};

const CERT_IMAGES = [
  { img: "/content/_.jpg.jpeg",      rotate: -90 },
  { img: "/content/_.jpg (2).jpeg",  rotate: -90 },
  { img: "/content/_.jpg (8).jpeg",  rotate: -90 },
  { img: "/content/_.jpg (10).jpeg" },
];

export default function HomeUI({ content }: { content: Record<string, string> }) {
  const { locale, dict } = useLocale();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 55 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isRtl = locale === "ar";
  const textAlign = isRtl ? "text-right" : "text-left";

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-rose/30 pt-[72px]">

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[3px] bg-rose z-[200] origin-right"
        style={{ scaleX }}
      />

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/201142632709"
        target="_blank"
        rel="noopener"
        className="fixed bottom-8 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-rose to-rose-dark text-white flex items-center justify-center shadow-2xl shadow-rose/40 ring-4 ring-rose/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.08, 1] , opacity: 1 }}
        transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }, opacity: { delay: 2.2, duration: 0.5 } }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </motion.a>

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center pt-6 lg:pt-24 overflow-hidden bg-white">
        <div className="absolute inset-0 hero-dots opacity-30 pointer-events-none" />
        <div className="absolute top-[-15%] end-[-5%] w-[600px] h-[600px] bg-rose/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] start-[-5%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center z-10 py-12">
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            className={`space-y-8 ${textAlign} order-2 lg:order-1`}
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-charcoal leading-[1.05] tracking-tight">
                {getContent(content, "hero_title_1", dict.hero.title1, locale)}{" "}
                <span className="text-rose">
                  {getContent(content, "hero_title_highlight", dict.hero.titleHighlight, locale)}
                </span>{" "}
                {getContent(content, "hero_title_2", dict.hero.title2, locale)} <br />
                {getContent(content, "hero_title_3", dict.hero.title3, locale)}
              </h1>
              <p className={`text-lg font-bold text-charcoal/50 max-w-lg ${isRtl ? "ms-auto" : "me-auto"} leading-relaxed`}>
                {getContent(content, "hero_description", dict.hero.subtitle, locale)}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-8 border-t border-charcoal/8">
              <div className="flex flex-nowrap items-end gap-x-6 gap-y-4 justify-start">
                <div className={textAlign}>
                  <div className="text-4xl lg:text-5xl font-black text-charcoal leading-none tracking-tight">
                    +<AnimatedCounter to={parseInt(getContent(content, "stats_1_value", dict.hero.stat1Value, locale).replace(/\D/g, ''))} />
                  </div>
                  <div className="text-[10px] font-bold text-charcoal/35 mt-2">
                    {getContent(content, "stats_1_label", dict.hero.stat1Label, locale)}
                  </div>
                </div>
                <div className="w-px h-10 bg-charcoal/10 self-center hidden sm:block" />
                <div className={textAlign}>
                  <div className="text-3xl lg:text-4xl font-black text-rose leading-none tracking-tight">
                    <AnimatedCounter to={parseInt(getContent(content, "stats_2_value", dict.hero.stat2Value, locale).replace(/\D/g, ''))} />
                    <span className="text-xl font-bold"> {dict.hero.stat2Unit}</span>
                  </div>
                  <div className="text-[10px] font-bold text-charcoal/35 mt-2">
                    {getContent(content, "stats_2_label", dict.hero.stat2Label, locale)}
                  </div>
                </div>
                <div className="w-px h-10 bg-charcoal/10 self-center hidden sm:block" />
                <div className={textAlign}>
                  <div className="text-3xl lg:text-4xl font-black text-charcoal leading-none tracking-tight">
                    +<AnimatedCounter to={parseInt(getContent(content, "stats_3_value", dict.hero.stat3Value, locale).replace(/\D/g, ''))} />
                  </div>
                  <div className="text-[10px] font-bold text-charcoal/35 mt-2">
                    {getContent(content, "stats_3_label", dict.hero.stat3Label, locale)}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-4">
              <Link href={`/${locale}/plans`} className="btn-shine inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-charcoal text-white text-lg font-black hover:bg-charcoal-dark shadow-xl transition-all">
                {dict.hero.cta}
                <ArrowRight size={20} className={!isRtl ? "" : ""} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-[380px] lg:max-w-[460px] aspect-[4/5] rounded-[48px] overflow-hidden shadow-[0_48px_96px_-16px_rgba(0,0,0,0.3)] bg-charcoal border-[10px] border-rose/30 group">
              <Image
                src={getContent(content, "hero_image", "/coach-batoula.jpg")}
                alt={dict.hero.imageAlt}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-1000"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-7 ${textAlign} order-2 lg:order-1`}>
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-black text-charcoal leading-tight">
                  {getContent(content, "about_title", dict.about.title, locale)}{" "}
                  <span className="text-rose">
                    {getContent(content, "about_title_highlight", dict.about.titleHighlight, locale)}
                  </span>{" "}
                  {getContent(content, "about_title_end", dict.about.titleEnd, locale)}
                </h2>
                <div className={`w-16 h-1.5 bg-gold rounded-full ${isRtl ? "ms-auto" : "me-auto"}`} />
              </div>

              <p className="text-base font-bold text-charcoal/65 leading-relaxed">
                {getContent(content, "about_description", dict.about.intro, locale)}
              </p>

              <div className="border-t border-charcoal/8">
                {dict.about.credentials.map((text: string, idx: number) => (
                  <div key={idx} className="flex items-baseline gap-4 py-4 border-b border-charcoal/8 group">
                    <span className="text-xs font-black text-charcoal/20 shrink-0 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-bold text-charcoal/70 group-hover:text-charcoal transition-colors leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>

              <div className="p-7 rounded-[32px] bg-charcoal text-white italic text-lg font-bold leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose/10 blur-2xl" />
                &quot;{dict.about.quote}&quot;
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] w-full max-w-[400px] shadow-xl border-[10px] border-rose/30">
                <Image
                  src={getContent(content, "about_image", "/coach-batoula-about.jpg")}
                  alt={dict.hero.imageAlt}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
              </div>
              <div className={`absolute -bottom-6 ${isRtl ? "-start-6" : "-end-6"} glass p-6 rounded-[32px] shadow-xl border border-white/20`}>
                <div className="text-4xl font-black text-rose mb-1">
                  {getContent(content, "about_weight_loss", dict.about.weightLoss, locale)}
                </div>
                <div className="text-xs font-black text-charcoal">
                  {getContent(content, "about_weight_loss_label", dict.about.weightLossLabel, locale)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center mb-14 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-charcoal">{dict.plans.sectionTitle}</h2>
            <p className="text-charcoal/50 text-xl font-bold">{dict.plans.sectionSubtitle}</p>
          </motion.div>

          <motion.div variants={staggerGrid} initial="hidden" whileInView="show" className="grid lg:grid-cols-3 gap-7">
            {/* Plan 1 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col">
              <div className={`space-y-2 mb-7 ${textAlign}`}>
                <h3 className="text-3xl font-black text-charcoal">{dict.plans.plan1.name}</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-charcoal">{dict.plans.plan1.price}</span>
                  <span className="text-xs text-charcoal/40 font-bold">{dict.plans.plan1.period}</span>
                </div>
                <p className="text-sm text-charcoal/60 font-bold">{dict.plans.plan1.description}</p>
              </div>
              <ul className={`space-y-4 mb-8 flex-1 ${textAlign}`}>
                {dict.plans.plan1.benefits.map((item: string, i: number) => (
                  <li key={i} className={`flex items-start gap-3 ${isRtl ? "justify-end" : "justify-start"}`}>
                    <span className="flex-1 text-charcoal/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-gold shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className={`mb-6 ${textAlign}`}>
                <div className="text-xs font-black text-rose">{dict.plans.plan1.tagline}</div>
                <div className="text-[10px] text-charcoal/40 font-bold mt-1">{dict.plans.plan1.renewal}</div>
              </div>
              <Link href={`/${locale}/plans/basic`} className="btn-shine w-full py-4 rounded-2xl bg-charcoal text-white font-black text-center hover:bg-charcoal-dark transition-all flex items-center justify-center gap-2">
                {dict.plans.viewDetails}
              </Link>
            </motion.div>

            {/* Plan 2 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col border-rose ring-4 ring-rose/10 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose text-white px-5 py-1.5 rounded-full text-xs font-black shadow-lg">{dict.plans.mostPopular}</div>
              <div className={`space-y-2 mb-7 ${textAlign}`}>
                <h3 className="text-3xl font-black text-charcoal">{dict.plans.plan2.name}</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-charcoal">{dict.plans.plan2.price}</span>
                  <span className="text-xs text-charcoal/40 font-bold">{dict.plans.plan2.period}</span>
                </div>
                <p className="text-sm text-charcoal/60 font-bold">{dict.plans.plan2.description}</p>
              </div>
              <ul className={`space-y-4 mb-8 flex-1 ${textAlign}`}>
                {dict.plans.plan2.benefits.map((item: string, i: number) => (
                  <li key={i} className={`flex items-start gap-3 ${isRtl ? "justify-end" : "justify-start"}`}>
                    <span className="flex-1 text-charcoal/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-rose shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className={`mb-6 ${textAlign}`}>
                <div className="text-xs font-black text-rose">{dict.plans.plan2.tagline}</div>
              </div>
              <Link href={`/${locale}/plans/premium`} className="btn-shine w-full py-4 rounded-2xl bg-rose text-white font-black text-center hover:bg-rose-dark transition-all shadow-xl flex items-center justify-center gap-2">
                {dict.plans.viewDetails}
              </Link>
            </motion.div>

            {/* Plan 3 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col text-white" style={{ background: "var(--charcoal)" }}>
              <div className={`space-y-2 mb-7 ${textAlign}`}>
                <h3 className="text-3xl font-black text-gold">{dict.plans.plan3.name}</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-gold">{dict.plans.plan3.price}</span>
                  <span className="text-xs text-white/40 font-bold">{dict.plans.plan3.period}</span>
                </div>
                <p className="text-sm text-white/60 font-bold">{dict.plans.plan3.description}</p>
              </div>
              <ul className={`space-y-4 mb-8 flex-1 ${textAlign}`}>
                {dict.plans.plan3.benefits.map((item: string, i: number) => (
                  <li key={i} className={`flex items-start gap-3 ${isRtl ? "justify-end" : "justify-start"}`}>
                    <span className="flex-1 text-white/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-gold shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className={`mb-6 ${textAlign}`}>
                <div className="text-xs font-black text-gold">{dict.plans.plan3.tagline}</div>
              </div>
              <Link href={`/${locale}/plans/ultimate`} className="btn-shine w-full py-4 rounded-2xl bg-gold text-charcoal font-black text-center hover:bg-gold-dark transition-all flex items-center justify-center gap-2">
                {dict.plans.viewDetails}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-[-10%] start-[-5%] w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center mb-14 space-y-4">
            <span className="inline-block text-rose font-black tracking-widest text-xs uppercase px-4 py-2 rounded-full bg-rose/5 border border-rose/15">
              {dict.consultation.badge}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal">
              {dict.consultation.title}{" "}
              <span className="text-rose">{dict.consultation.titleHighlight}</span>
            </h2>
            <p className="text-charcoal/50 text-lg font-bold max-w-2xl mx-auto leading-relaxed">
              {dict.consultation.subtitle}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="max-w-3xl mx-auto">
            <div className="premium-card p-8 lg:p-10 border-rose ring-4 ring-rose/10 relative">
              <div className={`space-y-6 ${textAlign}`}>
                {dict.consultation.features.map((f: { title: string; desc: string }, i: number) => (
                  <div key={i} className={`flex items-start gap-4 ${isRtl ? "flex-row" : "flex-row"}`}>
                    <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} className="text-rose" />
                    </div>
                    <div className={isRtl ? "text-right" : "text-left"}>
                      <h4 className="font-black text-charcoal text-base">{f.title}</h4>
                      <p className="text-charcoal/55 text-sm leading-relaxed mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-xl bg-charcoal/5 border border-charcoal/8 ${textAlign}`}>
                <p className="text-xs text-charcoal/50 font-bold">{dict.consultation.note}</p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-charcoal/8">
                <div className={textAlign}>
                  <div className="text-xs text-charcoal/40 font-bold">{dict.consultation.priceLabel}</div>
                  <div className="text-4xl font-black text-rose">{dict.consultation.price}</div>
                </div>
                <Link
                  href={`/${locale}/checkout/consultation`}
                  className="btn-shine px-10 py-4 rounded-2xl bg-rose text-white font-black text-center hover:bg-rose-dark transition-all shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {dict.consultation.cta}
                  <Zap size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BOOK */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-[-10%] end-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] start-[-5%] w-[400px] h-[400px] bg-rose/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Book mockup */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              className={`flex justify-center order-1 ${isRtl ? "lg:order-2" : "lg:order-1"}`}
            >
              <div className="relative">
                {/* Book shadow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-12 bg-charcoal/10 blur-2xl rounded-full" />

                {/* Book container */}
                <div className="relative w-[280px] sm:w-[320px] group">
                  {/* Book spine effect */}
                  <div className="absolute top-0 bottom-0 start-0 w-[18px] bg-gradient-to-r from-charcoal/20 to-transparent rounded-s-lg z-10" />

                  {/* Book cover */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border-[6px] border-white ring-1 ring-charcoal/10 group-hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.35)] transition-shadow duration-500">
                    <Image
                      src="/book-cover.jpg"
                      alt={`${dict.book.title} ${dict.book.titleHighlight} ${dict.book.titleEnd}`}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Pages effect */}
                  <div className="absolute top-[3px] bottom-[3px] -end-[5px] w-[5px] bg-gradient-to-b from-[#f5f0e8] via-[#ebe5da] to-[#f5f0e8] rounded-e-sm" />
                  <div className="absolute top-[6px] bottom-[6px] -end-[9px] w-[4px] bg-gradient-to-b from-[#ece7df] via-[#e2dbd0] to-[#ece7df] rounded-e-sm" />
                </div>

                {/* Badge */}
                <div className="absolute -top-4 -end-4 bg-gold text-charcoal px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-gold/30 z-20">
                  {dict.book.previewPages}
                </div>
              </div>
            </motion.div>

            {/* Book info */}
            <motion.div
              initial="hidden" whileInView="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className={`space-y-8 order-2 ${isRtl ? "lg:order-1 text-right" : "lg:order-2 text-left"}`}
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="inline-block text-rose font-black tracking-widest text-xs uppercase px-4 py-2 rounded-full bg-rose/5 border border-rose/15">
                  {dict.book.badge}
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-charcoal leading-tight">
                  {dict.book.title}{" "}
                  <span className="text-rose">{dict.book.titleHighlight}</span>{" "}
                  {dict.book.titleEnd}
                </h2>
                <p className="text-lg text-charcoal/50 font-bold leading-relaxed max-w-lg">
                  {dict.book.subtitle}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Heart size={20} />, title: dict.book.feature1Title, desc: dict.book.feature1Desc },
                  { icon: <BookOpen size={20} />, title: dict.book.feature2Title, desc: dict.book.feature2Desc },
                  { icon: <ShieldCheck size={20} />, title: dict.book.feature3Title, desc: dict.book.feature3Desc },
                ].map((f, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-background border border-charcoal/5 hover:border-rose/20 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center text-rose mb-3 group-hover:bg-rose group-hover:text-white transition-colors">
                      {f.icon}
                    </div>
                    <h4 className="font-black text-charcoal text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-charcoal/50 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className={`flex flex-wrap items-center gap-6 pt-4 ${isRtl ? "justify-end" : "justify-start"}`}>
                <Link
                  href={`/${locale}/checkout/book`}
                  className="btn-shine inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-charcoal text-white text-lg font-black hover:bg-charcoal-dark shadow-xl transition-all"
                >
                  {dict.book.cta}
                  <ArrowRight size={20} />
                </Link>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <div className="text-3xl font-black text-rose">{dict.book.price}</div>
                  <div className="text-xs text-charcoal/40 font-bold">{dict.book.priceNote}</div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SNACK BOOK */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="absolute top-[-10%] start-[-10%] w-[500px] h-[500px] bg-rose/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] end-[-5%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Snack book info — opposite side from the recipe book */}
            <motion.div
              initial="hidden" whileInView="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className={`space-y-8 order-2 ${isRtl ? "lg:order-2 text-right" : "lg:order-1 text-left"}`}
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <span className="inline-block text-gold font-black tracking-widest text-xs uppercase px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
                  {dict.snackBook.badge}
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-charcoal leading-tight">
                  {dict.snackBook.title}{" "}
                  <span className="text-rose">{dict.snackBook.titleHighlight}</span>{" "}
                  {dict.snackBook.titleEnd}
                </h2>
                <p className="text-lg text-charcoal/50 font-bold leading-relaxed max-w-lg">
                  {dict.snackBook.subtitle}
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Coffee size={20} />,  title: dict.snackBook.feature1Title, desc: dict.snackBook.feature1Desc },
                  { icon: <Apple size={20} />,   title: dict.snackBook.feature2Title, desc: dict.snackBook.feature2Desc },
                  { icon: <Clock size={20} />,   title: dict.snackBook.feature3Title, desc: dict.snackBook.feature3Desc },
                ].map((f, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-charcoal/5 hover:border-gold/30 hover:shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-gold mb-3 group-hover:bg-gold group-hover:text-white transition-colors">
                      {f.icon}
                    </div>
                    <h4 className="font-black text-charcoal text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-charcoal/50 font-medium leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className={`flex flex-wrap items-center gap-6 pt-4 ${isRtl ? "justify-end" : "justify-start"}`}>
                <Link
                  href={`/${locale}/checkout/snack-book`}
                  className="btn-shine inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gold text-charcoal text-lg font-black hover:bg-gold-dark shadow-xl transition-all"
                >
                  {dict.snackBook.cta}
                  <ArrowRight size={20} />
                </Link>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <div className="text-3xl font-black text-rose">{dict.snackBook.price}</div>
                  <div className="text-xs text-charcoal/40 font-bold">{dict.snackBook.priceNote}</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Snack book mockup */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              className={`flex justify-center order-1 ${isRtl ? "lg:order-1" : "lg:order-2"}`}
            >
              <div className="relative">
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-12 bg-charcoal/10 blur-2xl rounded-full" />

                <div className="relative w-[280px] sm:w-[320px] group">
                  <div className="absolute top-0 bottom-0 start-0 w-[18px] bg-gradient-to-r from-charcoal/20 to-transparent rounded-s-lg z-10" />

                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border-[6px] border-white ring-1 ring-charcoal/10 group-hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.35)] transition-shadow duration-500">
                    <Image
                      src={getContent(content, "snack_book_image", "/snack-book-cover.jpg")}
                      alt={`${dict.snackBook.title} ${dict.snackBook.titleHighlight} ${dict.snackBook.titleEnd}`}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  <div className="absolute top-[3px] bottom-[3px] -end-[5px] w-[5px] bg-gradient-to-b from-[#f5f0e8] via-[#ebe5da] to-[#f5f0e8] rounded-e-sm" />
                  <div className="absolute top-[6px] bottom-[6px] -end-[9px] w-[4px] bg-gradient-to-b from-[#ece7df] via-[#e2dbd0] to-[#ece7df] rounded-e-sm" />
                </div>

                <div className="absolute -top-4 -start-4 bg-rose text-white px-4 py-2 rounded-full text-xs font-black shadow-lg shadow-rose/30 z-20">
                  {dict.snackBook.price}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* MOBILE APP */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-[-10%] start-[-5%] w-[500px] h-[500px] bg-rose/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center space-y-5 mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal">
              {dict.app.title}{" "}
              <span className="text-rose">{dict.app.titleHighlight}</span>
            </h2>
            <p className="text-charcoal/50 text-lg font-bold max-w-xl mx-auto leading-relaxed">
              {dict.app.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <a
              href="https://apps.apple.com/eg/app/coachbatoul/id6761961312"
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-charcoal text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-charcoal-dark transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {dict.app.appStore}
            </a>
            <a
              href="https://coachbatoul.beprime.site"
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-rose text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-rose-dark transition-all"
            >
              <Globe size={22} className="shrink-0" />
              {dict.app.webApp}
            </a>
          </motion.div>
        </div>
      </section>

      <Wave bg="var(--background)" fill="var(--charcoal)" />

      {/* MISSION */}
      <section id="mission" className="bg-charcoal text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-dots opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black leading-tight italic text-rose">
              &quot;{getContent(content, "mission_quote", dict.mission.quote, locale)}&quot;
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {getContent(content, "mission_description", dict.mission.description, locale)}
            </p>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${textAlign}`}>
             {dict.mission.pillars.map((f: { title: string; desc: string; num: string }, i: number) => (
               <div key={i} className="glass-dark p-8 rounded-[32px] group hover:bg-white/10 transition-all duration-300">
                 <span className={`text-4xl font-black text-rose mb-5 block group-hover:scale-110 transition-transform ${isRtl ? "origin-right" : "origin-left"}`}>{f.num}</span>
                 <h3 className="text-xl font-black mb-3 text-white group-hover:text-gold transition-colors">{f.title}</h3>
                 <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="space-y-5 mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal leading-tight">
              {getContent(content, "trans_title", dict.results.title, locale)}
              <br />
              <span className="text-rose">
                {getContent(content, "trans_title_highlight", dict.results.titleHighlight, locale)}
              </span>
            </h2>
            <p className="text-charcoal/50 leading-relaxed text-lg font-bold max-w-xl mx-auto">
              {getContent(content, "trans_description", dict.results.subtitle, locale)}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-[3/4] max-w-[420px] mx-auto border-8 border-rose/30 mb-12">
            <Image
              src={getContent(content, "trans_image", "/coach-batoula-certificate.jpg")}
              alt={dict.results.imageAlt}
              fill
              className="object-cover object-[center_15%]"
              unoptimized
            />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTY2NjM3MDE3MzQzMTA3?story_media_id=3658309895048581954_64460263235&igsh=MTlpcWp2czc1MWE4YQ=="
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-rose text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-rose-dark transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              {dict.results.link1}
            </a>
            <a
              href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTA3ODE4MTg0MjU3NTU0?story_media_id=3781432868736892666_64460263235&igsh=MXViMnhkOW02OHg5aA=="
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-charcoal text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-charcoal-dark transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              {dict.results.link2}
            </a>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-14 border-b border-charcoal/8 pb-6">
            <h2 className="text-3xl font-black text-charcoal">{dict.testimonials.title}</h2>
            <span className="text-xs font-bold text-charcoal/30 tracking-wide">{dict.testimonials.count}</span>
          </div>
          <div className={`grid lg:grid-cols-5 gap-6 ${textAlign} items-start`}>
            <div className="lg:col-span-3 bg-charcoal text-white p-10 rounded-[40px] flex flex-col justify-between min-h-[280px]">
              <p className="text-xl lg:text-2xl font-bold leading-relaxed text-white/90 flex-1">
                &ldquo;{dict.testimonials.featured}&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-rose text-xs font-black px-3 py-1 rounded-full border border-rose/30">{dict.testimonials.featuredTag}</span>
                <span className="font-black text-white/60 text-sm">{dict.testimonials.featuredAuthor}</span>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-6">
              {dict.testimonials.items.map((t: { name: string; quote: string; tag: string }, i: number) => (
                <div key={i} className="bg-white p-7 rounded-[32px] border border-charcoal/5 flex flex-col gap-4">
                  <p className="text-charcoal/65 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
                    <span className="text-[10px] text-rose font-black uppercase tracking-wide">{t.tag}</span>
                    <span className="font-black text-charcoal text-xs">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section id="certs" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center space-y-4 mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal">{dict.certs.title}</h2>
            <p className="text-charcoal/50 text-lg">{dict.certs.subtitle}</p>
          </motion.div>
          <motion.div variants={staggerGrid} initial="hidden" whileInView="show" className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CERT_IMAGES.map((cert, idx) => {
              const rotate = (cert as { rotate?: number }).rotate;
              const translated = dict.certs.items[idx];
              return (
                <motion.div key={idx} variants={staggerItem} className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  {rotate ? (
                    <div
                      className="absolute top-1/2 left-1/2"
                      style={{ width: "133.34%", height: "75%", transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
                    >
                      <Image src={cert.img} alt={translated?.title || ""} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <Image src={cert.img} alt={translated?.title || ""} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" unoptimized />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-center">
                    <div className="text-white font-black text-sm leading-snug">{translated?.title}</div>
                    <div className="text-white/60 text-xs mt-0.5">{translated?.sub}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
          <div className="mb-14">
            <h2 className="text-3xl font-black text-charcoal">{dict.faq.title}</h2>
            <div className="w-12 h-0.5 bg-rose mt-3" />
          </div>
          <div className="divide-y divide-charcoal/8">
            {dict.faq.items.map((faq: { q: string; a: string }, i: number) => (
              <div key={i} className="py-6 cursor-pointer group" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex justify-between items-center">
                  <span className={`flex-1 font-black text-lg transition-colors ${openFaq === i ? 'text-rose' : 'text-charcoal group-hover:text-rose'}`}>
                    {getContent(content, `faq_${i + 1}_q`, faq.q, locale)}
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-300 ms-4 shrink-0 ${openFaq === i ? 'rotate-180 text-rose' : 'text-charcoal/25'}`} />
                </div>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-charcoal/55 text-base font-semibold leading-relaxed pe-8"
                  >
                    {getContent(content, `faq_${i + 1}_a`, faq.a, locale)}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
