import prisma from "@/lib/prisma";
import { ArrowRight, CheckCircle, ShieldCheck, Zap, PlayCircle, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.meta.planDetailTitle,
    description: dict.meta.planDetailDescription,
  };
}

export default async function PlanDetailsPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const dbPlan = await prisma.plan.findUnique({
    where: { slug },
  });

  if (!dbPlan) notFound();

  const plan = {
    ...dbPlan,
    title: locale === "en" && dbPlan.titleEn ? dbPlan.titleEn : dbPlan.title,
    benefits: locale === "en" && dbPlan.benefitsEn.length > 0 ? dbPlan.benefitsEn : dbPlan.benefits,
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`space-y-10 order-1 ${locale === "ar" ? "text-right" : "text-left"}`}
          >
            <div className="space-y-6">
              <Link href={`/${locale}/plans`} className={`flex items-center gap-2 text-rose font-bold text-sm mb-6 group ${locale === "ar" ? "justify-end" : "justify-start"}`}>
                <span className={`transition-transform ${locale === "ar" ? "group-hover:translate-x-[-4px]" : "group-hover:translate-x-[4px]"}`}>{dict.planDetails.backToPlans}</span>
                <ArrowRight size={18} className={locale === "en" ? "rotate-180" : ""} />
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black text-charcoal leading-tight">
                {plan.title}
              </h1>
              <div className={`flex items-center gap-3 pt-2 ${locale === "ar" ? "justify-end" : "justify-start"}`}>
                <div className={locale === "ar" ? "text-right" : "text-left"}>
                  <div className="text-[10px] font-bold text-gray-400">{dict.planDetails.priceLabel}</div>
                  <div className="text-[9px] font-black text-charcoal uppercase tracking-tighter">{dict.planDetails.priceNote}</div>
                </div>
                <span className="text-5xl lg:text-6xl font-black text-rose">${plan.price}</span>
              </div>
            </div>

            <div className={`p-6 rounded-[32px] bg-rose/5 border border-rose/10 flex items-center gap-4 shadow-sm ${locale === "ar" ? "justify-end" : "justify-start"}`}>
              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <div className="text-base font-black text-charcoal">{dict.planDetails.guaranteeTitle}</div>
                <div className="text-xs text-charcoal/60 font-medium">{dict.planDetails.guaranteeDesc}</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-rose shadow-sm">
                <ShieldCheck size={24} />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-black text-charcoal border-b border-gold/20 pb-3 inline-block">{dict.planDetails.benefitsTitle}</h3>
              <div className="grid gap-4">
                {plan.benefits.map((benefit: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-charcoal/5 transition-all duration-300 group ${locale === "ar" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex-1 text-charcoal/70 font-bold text-base leading-relaxed group-hover:text-charcoal transition-colors ${locale === "ar" ? "text-right" : "text-left"}`}>{benefit}</div>
                    <div className="w-7 h-7 rounded-full bg-rose/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="text-rose" size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={`/${locale}/checkout/${plan.slug}`}
                className="btn-shine px-12 py-5 rounded-2xl bg-charcoal text-white text-lg font-black hover:bg-charcoal-dark transition-all shadow-xl flex items-center justify-center gap-3 w-full"
              >
                {dict.planDetails.subscribeCta}
                <Zap size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center order-2"
          >
            <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-[48px] overflow-hidden bg-charcoal shadow-2xl group border-[12px] border-white ring-1 ring-charcoal/5">
              {plan.videoUrl ? (
                <iframe
                  src={plan.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-charcoal via-[#1a1715] to-charcoal">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-rose/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  >
                    <PlayCircle className="text-rose" size={40} />
                  </motion.div>
                  <h4 className="text-white text-xl font-black mb-3">{dict.planDetails.videoTitle}</h4>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">{dict.planDetails.videoDesc}</p>
                </div>
              )}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-[380px]">
              <div className="bg-white p-6 rounded-[32px] border border-charcoal/5 text-center shadow-md hover:-translate-y-1 transition-transform">
                <Star className="text-gold mx-auto mb-3 fill-gold" size={24} />
                <div className="text-2xl font-black text-charcoal">+500</div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{dict.planDetails.successStories}</div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-charcoal/5 text-center shadow-md hover:-translate-y-1 transition-transform">
                <ShieldCheck className="text-rose mx-auto mb-3" size={24} />
                <div className="text-2xl font-black text-charcoal">100%</div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{dict.planDetails.directFollow}</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
