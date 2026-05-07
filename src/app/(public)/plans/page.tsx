import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, Star, ArrowLeft } from "lucide-react";
import * as motion from "framer-motion/client";

export default async function PlansPage() {
  let plans = [];
  try {
    plans = await prisma.plan.findMany({
      orderBy: { price: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch plans from DB, using fallbacks", error);
    plans = [
      { id: '1', title: 'خطة البداية الأساسية', price: 45, slug: 'basic', benefits: ["اتصال شخصي لتقييم الحالة الصحية والغذائية","نظام غذائي مخصص بحسب الهدف ونمط الحياة","خطة رياضية مناسبة للمستوى البدني","تحديث النظام كل 10 أيام","متابعة مباشرة مع بتولة عبر واتساب"] },
      { id: '2', title: 'خطة التحول الكامل', price: 99, slug: 'premium', benefits: ["اتصال تفصيلي لتقييم الحالة وتحديد الأهداف","نظام غذائي مخصص يتناسب مع طبيعة الجسم","خطة رياضية عملية قابلة للتطبيق","تحديث النظام كل 15 يوم لضمان التحفيز","متابعة مستمرة ودعم خلال الرحلة كاملة"] },
      { id: '3', title: 'الخطة السنوية الشاملة', price: 299, slug: 'ultimate', benefits: ["اتصال شهري للمتابعة وتقييم التقدم","نظام غذائي مخصص ومتجدد بحسب المرحلة","تجديد النظام كل 15 يوم طوال العام","خطة خاصة لشهر رمضان المبارك","دعم مستمر لضمان استمرارية النتائج"] },
    ];
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="inline-block text-rose font-black tracking-widest text-xs uppercase px-4 py-2 rounded-full bg-rose-light border border-rose/15">
            باقات الاشتراك
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-charcoal">باقات التغيير</h1>
          <p className="text-charcoal/50 text-xl max-w-2xl mx-auto font-bold leading-relaxed">
            اختاري الباقة التي تناسب أهدافكِ وابدأي رحلة التحول اليوم مع متابعة شخصية دقيقة.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group flex flex-col p-8 rounded-[32px] border transition-all duration-500 ${
                plan.slug === 'premium' 
                  ? 'bg-white border-rose ring-4 ring-rose/5 shadow-2xl shadow-rose/10 scale-105 z-10' 
                  : 'bg-white border-charcoal/5 hover:border-rose/20 shadow-xl shadow-charcoal/5'
              }`}
            >
              {plan.slug === 'premium' && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose text-white px-6 py-2 rounded-full text-xs font-black shadow-lg shadow-rose/20 flex items-center gap-2 whitespace-nowrap">
                  <Star size={14} className="fill-white" />
                  الأكثر طلباً وتحقيقاً للنتائج
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-black text-charcoal mb-2">{plan.title}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-charcoal">${plan.price}</span>
                  <span className="text-charcoal/30 text-sm font-bold">/ للفترة</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.benefits.map((benefit: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-rose shrink-0 mt-0.5" />
                    <span className="text-charcoal/65 text-sm font-bold leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Link 
                href={`/plans/${plan.slug}`}
                className={`w-full py-4 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 ${
                  plan.slug === 'premium'
                    ? 'bg-rose text-white shadow-xl shadow-rose/20 hover:bg-rose-dark'
                    : 'bg-charcoal text-white hover:bg-charcoal-dark'
                }`}
              >
                تفاصيل الباقة والاشتراك
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-col items-center gap-6 p-10 rounded-[40px] bg-charcoal text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose/10 rounded-full blur-[80px]" />
          <div className="relative z-10 text-center space-y-4">
            <h3 className="text-2xl font-black">مو متأكدة أي باقة بتناسبك؟</h3>
            <p className="text-white/50 font-bold">تواصلي معي شخصياً على واتساب ورح نحدد الباقة الأنسب لحالتك</p>
            <a 
              href="https://wa.me/"
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-charcoal rounded-full font-black hover:bg-rose-light transition-all"
            >
              استشارة مجانية على واتساب
              <ArrowLeft className="rotate-45" size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
