"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  Heart, Star, ShieldCheck, Zap, CheckCircle2, ArrowRight,
  ChevronDown, BookOpen, Award, GraduationCap, TrendingDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { getContent } from "@/lib/cms";

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

const CERTIFICATES = [
  { img: "/content/_.jpg (3).jpeg",  title: "SuperHuman Clinics",  sub: "تدريب عملي في التغذية العلاجية",  orient: "portrait"  },
  { img: "/content/_.jpg (5).jpeg",  title: "Challenge Academy",   sub: "تغذية سريرية ورياضية والسمنة",   orient: "portrait"  },
  { img: "/content/_.jpg (9).jpeg",  title: "ICNC 2026",           sub: "مؤتمر التغذية التجميلية الدولي", orient: "portrait"  },
  { img: "/content/_.jpg.jpeg",      title: "ICN Certificate",     sub: "شهادة في التغذية الصحية",        orient: "landscape", rotate: -90 },
  { img: "/content/_.jpg (2).jpeg",  title: "Diabetes Workshop",   sub: "ورشة عمل متخصصة بالسكري",        orient: "landscape", rotate: -90 },
  { img: "/content/_.jpg (8).jpeg",  title: "CFT Course",          sub: "تشريح الجسم وتصميم البرامج",     orient: "landscape", rotate: -90 },
  { img: "/content/_.jpg (6).jpeg",  title: "شهادة الدبلوم",       sub: "بتولة تحمل شهادة الدبلوم",       orient: "landscape" },
  { img: "/content/_.jpg (10).jpeg", title: "مع شهاداتها",         sub: "بتولة مع شهاداتها",              orient: "landscape" },
  { img: "/content/_.jpg (11).jpeg", title: "INSEP PRO",           sub: "بتولة في INSEP PRO",             orient: "landscape" },
];

function CertCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cert]");
    const amount = (card ? card.offsetWidth : 224) + 16;
    const max = el.scrollWidth - el.clientWidth;
    const next = el.scrollLeft + dir * amount;
    if (next >= max - 2) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (next <= 2) el.scrollTo({ left: max, behavior: "smooth" });
    else el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => step(1), 3200);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Prev */}
      <button
        onClick={() => step(-1)}
        aria-label="السابق"
        className="absolute -start-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-charcoal/10 flex items-center justify-center text-charcoal hover:bg-rose-light hover:text-rose transition-colors"
      >
        <ChevronRight size={18} />
      </button>
      {/* Next */}
      <button
        onClick={() => step(1)}
        aria-label="التالي"
        className="absolute -end-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-charcoal/10 flex items-center justify-center text-charcoal hover:bg-rose-light hover:text-rose transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="-mx-6 overflow-hidden" dir="ltr">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-6 no-scrollbar"
        >
          {CERTIFICATES.map((cert, idx) => {
            const rotate = (cert as { rotate?: number }).rotate;
            return (
              <div key={idx} data-cert="" className="snap-start shrink-0 group relative w-52 h-72 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {rotate ? (
                  // Sideways photo: inner div is landscape-sized, centred, then rotated
                  // so the certificate fills the portrait card with no gaps.
                  <div
                    className="absolute top-1/2 left-1/2"
                    style={{ width: "133.34%", height: "75%", transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
                  >
                    <Image src={cert.img} alt={cert.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <Image src={cert.img} alt={cert.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-300" unoptimized />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-right">
                  <div className="text-white font-black text-sm leading-snug">{cert.title}</div>
                  <div className="text-white/60 text-xs mt-0.5">{cert.sub}</div>
                </div>
              </div>
            );
          })}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function HomeUI({ content }: { content: Record<string, string> }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 55 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-rose/30 pt-[72px]">

      {/* ── Scroll progress ───────────────────── */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[3px] bg-rose z-[200] origin-right"
        style={{ scaleX }}
      />

      {/* ── Floating WhatsApp ─────────────────── */}
      <motion.a
        href="https://wa.me/"
        target="_blank"
        rel="noopener"
        className="pulse-ring fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-green-500/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.2, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </motion.a>

      {/* ── HERO ───────────────────── */}
      <section className="relative min-h-[85vh] flex items-center pt-24 overflow-hidden bg-white">
        {/* Abstract background elements */}
        <div className="absolute inset-0 hero-dots opacity-30 pointer-events-none" />
        <div className="absolute top-[-15%] end-[-5%] w-[600px] h-[600px] bg-rose/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] start-[-5%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center z-10 py-12">
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            className="space-y-8 text-right order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-charcoal leading-[1.05] tracking-tight">
                الرشاقة <span className="text-rose">تبدأ</span> بقرار، <br />
                والاستمرارية تصنع الفرق.
              </h1>
              <p className="text-lg font-bold text-charcoal/50 max-w-lg ms-auto leading-relaxed">
                رحلتي بلشت من تجربة شخصية لخسارة ٢٧ كيلو، واليوم أنا هون لحتى ساعدك توصلي لهدفك بأفضل الطرق العلمية والنفسية.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-8 border-t border-charcoal/8">
              <div className="flex flex-wrap items-end gap-x-8 gap-y-4 justify-start">
                <div className="text-right">
                  <div className="text-6xl lg:text-7xl font-black text-charcoal leading-none tracking-tight">
                    +<AnimatedCounter to={2000} />
                  </div>
                  <div className="text-xs font-bold text-charcoal/35 mt-2">ساعة تدريب مكثّف</div>
                </div>
                <div className="w-px h-12 bg-charcoal/10 self-center hidden sm:block" />
                <div className="text-right">
                  <div className="text-4xl lg:text-5xl font-black text-rose leading-none tracking-tight">
                    <AnimatedCounter to={27} /><span className="text-2xl font-bold"> كيلو</span>
                  </div>
                  <div className="text-xs font-bold text-charcoal/35 mt-2">إنجازي الشخصي</div>
                </div>
                <div className="w-px h-12 bg-charcoal/10 self-center hidden sm:block" />
                <div className="text-right">
                  <div className="text-4xl lg:text-5xl font-black text-charcoal leading-none tracking-tight">
                    +<AnimatedCounter to={500} />
                  </div>
                  <div className="text-xs font-bold text-charcoal/35 mt-2">متدربة حققت هدفها</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-4">
              <Link href="/plans" className="btn-shine inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-charcoal text-white text-lg font-black hover:bg-charcoal-dark shadow-xl transition-all">
                ابدأي رحلتك الآن
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[60px] overflow-hidden shadow-[0_48px_96px_-16px_rgba(0,0,0,0.3)] bg-charcoal border-[12px] border-white group">
              <Image 
                src="/coach-batoula.jpg" 
                alt="كوتش بتولة" 
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

      {/* ── ABOUT SECTION ───────────────────── */}
      <section id="about" className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div className="space-y-7 text-right order-2 lg:order-1">
              <div className="space-y-3">
                <h2 className="text-3xl lg:text-4xl font-black text-charcoal leading-tight">
                  من التجربة للعلم: <span className="text-rose">قصة التغيير</span> الحقيقية
                </h2>
                <div className="w-16 h-1.5 bg-gold rounded-full ms-auto" />
              </div>

              <p className="text-base font-bold text-charcoal/65 leading-relaxed">
                أنا بتول.. وقبل ما أكون مدربتك، أنا كنت بمكانك بيوم من الأيام. بلشت رحلتي بوزن زايد وتعب نفسي، بس قدرت بلحظة صدق مع حالي إني آخد القرار.
              </p>

              <div className="border-t border-charcoal/8">
                {[
                  { n: "01", text: "دبلوم تغذية علاجية من المعهد الأمريكي (American Institute)." },
                  { n: "02", text: "ماجستير علاجي للأمراض المزمنة — تعمّق في فهم الجسم." },
                  { n: "03", text: "Life Coach معتمدة لتدريب الصبايا على التغيير النفسي." },
                  { n: "04", text: "تدريب عملي بعيادات SuperHuman وحضور مؤتمرات دورية." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-baseline gap-4 py-4 border-b border-charcoal/8 group">
                    <span className="text-xs font-black text-charcoal/20 shrink-0 tabular-nums">{item.n}</span>
                    <span className="text-sm font-bold text-charcoal/70 group-hover:text-charcoal transition-colors leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-7 rounded-[32px] bg-charcoal text-white italic text-lg font-bold leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose/10 blur-2xl" />
                &quot;هدفي مو بس نزلك وزنك.. هدفي إنك تلاقي حالك، وتحبي جسمك، وتتعلمي كيف تعيشي حياة صحية للأبد.&quot;
              </div>
            </div>

            {/* Visual Column */}
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative rounded-[48px] overflow-hidden aspect-[4/5] w-full max-w-[400px] shadow-xl border-[10px] border-[#fafafa]">
                <Image src="/coach-batoula.jpg" alt="بتولة" fill className="object-cover object-top" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -start-6 glass p-6 rounded-[32px] shadow-xl border border-white/20">
                <div className="text-4xl font-black text-rose mb-1">27kg</div>
                <div className="text-xs font-black text-charcoal">خسارة موثقة بالعلم والتجربة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ───────────────────────────── */}
      <section id="plans" className="py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center mb-14 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-charcoal">باقات التغيير</h2>
            <p className="text-charcoal/50 text-xl font-bold">ليست حمية مؤقتة… بل رحلة حقيقية</p>
          </motion.div>

          <motion.div variants={staggerGrid} initial="hidden" whileInView="show" className="grid lg:grid-cols-3 gap-7">
            {/* Plan 1 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col">
              <div className="space-y-2 mb-7 text-right">
                <h3 className="text-3xl font-black text-charcoal">الخطوة الأولى</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-charcoal">$45</span>
                  <span className="text-xs text-charcoal/40 font-bold">/ شهر</span>
                </div>
                <p className="text-sm text-charcoal/60 font-bold">برنامج اشتراك لمدة شهر لخسارة الوزن بطريقة مدروسة وعملية.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-right">
                {[
                  "اتصال شخصي لتقييم الحالة الصحية والغذائية بدقة.",
                  "إعداد نظام غذائي مخصص بحسب الهدف ونمط الحياة.",
                  "خطة رياضية مناسبة للمستوى البدني.",
                  "تحديث النظام كل 10 أيام لضمان أفضل استجابة وتقدم مستمر."
                ].map((item,i)=>(
                  <li key={i} className="flex items-start gap-3 justify-end">
                    <span className="flex-1 text-charcoal/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-gold shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className="mb-6 text-right">
                <div className="text-xs font-black text-rose">بداية حقيقية… بخطوات ثابتة ونتائج محسوبة.</div>
                <div className="text-[10px] text-charcoal/40 font-bold mt-1">التجديد الشهري 35 دولار</div>
              </div>
              <Link href="/plans/basic" className="btn-shine w-full py-4 rounded-2xl bg-charcoal text-white font-black text-center hover:bg-charcoal-dark transition-all flex items-center justify-center gap-2">
                عرض التفاصيل
              </Link>
            </motion.div>

            {/* Plan 2 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col border-rose ring-4 ring-rose/10 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose text-white px-5 py-1.5 rounded-full text-xs font-black shadow-lg">الأكثر طلباً</div>
              <div className="space-y-2 mb-7 text-right">
                <h3 className="text-3xl font-black text-charcoal">تغيير خطير</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-charcoal">$99</span>
                  <span className="text-xs text-charcoal/40 font-bold">/ 3 شهور</span>
                </div>
                <p className="text-sm text-charcoal/60 font-bold">باقة مكثفة لمدة 3 شهور لإحداث نقلة واضحة في الوزن ونمط الحياة.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-right">
                {[
                  "اتصال تفصيلي لتقييم الحالة الصحية والغذائية وتحديد الأهداف بدقة.",
                  "إعداد نظام غذائي مخصص يتناسب مع طبيعة الجسم ونمط الحياة.",
                  "خطة رياضية عملية قابلة للتطبيق حسب المستوى البدني.",
                  "تحديث النظام كل 15 يوم لضمان استمرار التحفيز وتسريع النتائج."
                ].map((item,i)=>(
                  <li key={i} className="flex items-start gap-3 justify-end">
                    <span className="flex-1 text-charcoal/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-rose shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className="mb-6 text-right">
                <div className="text-xs font-black text-rose">التغيير لا يأتي صدفة… بل بخطة واضحة والتزام حقيقي.</div>
              </div>
              <Link href="/plans/premium" className="btn-shine w-full py-4 rounded-2xl bg-rose text-white font-black text-center hover:bg-rose-dark transition-all shadow-xl flex items-center justify-center gap-2">
                عرض التفاصيل
              </Link>
            </motion.div>

            {/* Plan 3 */}
            <motion.div variants={staggerItem} className="premium-card flex flex-col text-white" style={{ background: "var(--charcoal)" }}>
              <div className="space-y-2 mb-7 text-right">
                <h3 className="text-3xl font-black text-gold">الرحلة</h3>
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-4xl font-black text-gold">$299</span>
                  <span className="text-xs text-white/40 font-bold">/ سنة كاملة</span>
                </div>
                <p className="text-sm text-white/60 font-bold">باقة سنوية شاملة لبناء نمط حياة صحي ثابت ونتائج طويلة الأمد.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-right">
                {[
                  "اتصال شهري للمتابعة وتقييم التقدم وتعديل المسار عند الحاجة.",
                  "نظام غذائي مخصص ومتجدد بحسب المرحلة والتطور.",
                  "تجديد النظام كل 15 يوم للحفاظ على التحفيز ومنع الثبات.",
                  "خطة خاصة لشهر رمضان تراعي الصيام وتنظيم الوجبات.",
                  "دعم مستمر لضمان استمرارية النتائج طوال العام."
                ].map((item,i)=>(
                  <li key={i} className="flex items-start gap-3 justify-end">
                    <span className="flex-1 text-white/60 text-sm font-semibold leading-relaxed">{item}</span>
                    <CheckCircle2 size={17} className="text-gold shrink-0 mt-0.5" />
                  </li>
                ))}
              </ul>
              <div className="mb-6 text-right">
                <div className="text-xs font-black text-gold">ليست حمية مؤقتة… بل رحلة تغيير حقيقية تمتد لعام كامل.</div>
              </div>
              <Link href="/plans/ultimate" className="btn-shine w-full py-4 rounded-2xl bg-gold text-charcoal font-black text-center hover:bg-gold-dark transition-all flex items-center justify-center gap-2">
                عرض التفاصيل
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CERTIFICATES ───────────────────── */}
      <section id="certs" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="text-center space-y-4 mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal">شهادات معتمدة دولياً</h2>
            <p className="text-charcoal/50 text-lg">بتابع تطوير نفسي باستمرار عشان أعطيكم الأفضل دائماً</p>
          </motion.div>
          <CertCarousel />
        </div>
      </section>

      <Wave bg="var(--background)" fill="var(--charcoal)" />

      {/* ── MISSION ───────────────────────────── */}
      <section id="mission" className="bg-charcoal text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/hero-dots.png')] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black leading-tight italic text-rose">
              &quot;رسالتي إلك: القصة مو دايت، القصة حياة&quot;
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              أنا هون لحتى غيّر الفكرة اللي ببالنا كلنا عن الدايت. الدايت مو عقوبة، ولا هو فترة حرمان مؤقتة منخلص منها ومنرجع لعاداتنا القديمة. هدفي ساعدك تبني نمط حياة صحي بيمشيك العمر كله.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
             {[
               { title: "أكل البيت هو الأساس", desc: "فيكي تاكلي من نفس طبخ البيت اللي بتطبخيه لعيلتك، بس بتعديلات بسيطة وذكية ليصير صحي ومغذي.", num: "١" },
               { title: "بدون حرمان", desc: "الأكل متعة، ومستحيل نقدر نستمر إذا حارمين حالنا. السر هو الاعتدال مو المنع.", num: "٢" },
               { title: "واقعية ومرنة", desc: "بعرف إنّو الحياة فيها عزائم وشغل وضغوطات. النظام بيتفصّل على قياس حياتك.", num: "٣" },
               { title: "تعديل سلوك مو بس وزن", desc: "عم نشتغل لحتى نعدّل عاداتنا من الجذور، لحتى يصير الخيار الصحي هو الخيار الأسهل.", num: "٤" },
             ].map((f, i) => (
               <div key={i} className="glass-dark p-8 rounded-[32px] group hover:bg-white/10 transition-all duration-300">
                 <span className="text-4xl font-black text-rose mb-5 block group-hover:scale-110 transition-transform origin-right">{f.num}</span>
                 <h3 className="text-xl font-black mb-3 text-white group-hover:text-gold transition-colors">{f.title}</h3>
                 <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATION ───────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="space-y-5 mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-charcoal leading-tight">
              نتائج حقيقية
              <br />
              <span className="text-rose">قصص نجاح ملهمة</span>
            </h2>
            <p className="text-charcoal/50 leading-relaxed text-lg font-bold max-w-xl mx-auto">
              هون بنشوف ثمرة التعب والالتزام. صور حقيقية لمتدربات غيروا حياتهم للأفضل.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-square max-w-[420px] mx-auto border-8 border-background mb-12">
            <Image src="/coach-batoula-logo.jpg" alt="نتائج المتدربات" fill className="object-cover" unoptimized />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTY2NjM3MDE3MzQzMTA3?story_media_id=3658309895048581954_64460263235&igsh=MTlpcWp2czc1MWE4YQ=="
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-rose text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-rose-dark transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              نتائج المتدربات (1)
            </a>
            <a
              href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTA3ODE4MTg0MjU3NTU0?story_media_id=3781432868736892666_64460263235&igsh=MXViMnhkOW02OHg5aA=="
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex items-center gap-3 bg-charcoal text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-charcoal-dark transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              نتائج المتدربات (2)
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-14 border-b border-charcoal/8 pb-6">
            <h2 className="text-3xl font-black text-charcoal">كلام الصبايا</h2>
            <span className="text-xs font-bold text-charcoal/30 tracking-wide">+500 قصة نجاح</span>
          </div>
          <div className="grid lg:grid-cols-5 gap-6 text-right items-start">
            {/* Featured large quote */}
            <div className="lg:col-span-3 bg-charcoal text-white p-10 rounded-[40px] flex flex-col justify-between min-h-[280px]">
              <p className="text-xl lg:text-2xl font-bold leading-relaxed text-white/90 flex-1">
                &ldquo;بدي انزل بس 5 كيلو وكتيرررر صعب التزم وصعب ينزلو — بس مع بتولة مافي شي مستحيل. شهرين مرونة ووعي ونظام مريح بدون حرمان.&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-rose text-xs font-black px-3 py-1 rounded-full border border-rose/30">باقة 3 شهور</span>
                <span className="font-black text-white/60 text-sm">صبية بطلة</span>
              </div>
            </div>
            {/* Two smaller quotes stacked */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {[
                { name: "متدربة شاطرة", quote: "تعبها وربي يعطيها الف عافية — هي شاطرة، حابة الرحلة، مستمتعة فيا، بتعرف مصلحتا وعم تحاول وتستمر وتصبر.", tag: "الرحلة السنوية" },
                { name: "رفيقة الرحلة", quote: "متابعة ٣٠ يوم كفيلة نصير رفقة. الحمدالله كسبت اكتر من 100 رفيقة الشهرين الماضيين، فخورة بلنتائج وبردود الصبايا.", tag: "باقة شهر واحد" },
              ].map((t, i) => (
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

      {/* ── FAQ ───────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-6" dir="rtl">
          <div className="mb-14">
            <h2 className="text-3xl font-black text-charcoal">أسئلة كتير بتسألوها</h2>
            <div className="w-12 h-0.5 bg-rose mt-3" />
          </div>
          <div className="divide-y divide-charcoal/8">
            {[
              { q: "كم كيلو بنزل بلشهر؟", a: "من ٤ ل٦ كيلو حسب الوزن والعمر والحالة الصحية." },
              { q: "هل متاح دايت للحامل؟", a: "نعم متاح وبشكل آمن تماماً." },
              { q: "هل متاح دايت للمرضعات؟", a: "نعم متاح وبنظام يضمن احتياجاتك واحتياجات طفلك." },
              { q: "المتابعة مع بتولة شخصياً؟", a: "نعم مباشرة مع بتولة عبر الواتساب." },
              { q: "كروب ولا خاص؟", a: "متاح في الحالتين بحسب رغبتك." },
              { q: "إيمتى فينا نبدأ؟", a: "في حال تم الدفع بتم الحجز والتواصل خلال ١٢ ساعة." },
            ].map((faq, i) => (
              <div key={i} className="py-6 cursor-pointer group" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex justify-between items-center">
                  <span className={`flex-1 font-black text-lg transition-colors ${openFaq === i ? 'text-rose' : 'text-charcoal group-hover:text-rose'}`}>{faq.q}</span>
                  <ChevronDown size={18} className={`transition-transform duration-300 ms-4 shrink-0 ${openFaq === i ? 'rotate-180 text-rose' : 'text-charcoal/25'}`} />
                </div>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-charcoal/55 text-base font-semibold leading-relaxed pe-8"
                  >
                    {faq.a}
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
