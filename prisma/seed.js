const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing content to ensure freshness if needed, or just upsert
  console.log("Seeding plans...");

  const plans = [
    {
      slug: 'basic',
      title: 'الخطوة الأولى',
      titleEn: 'First Step',
      price: 45,
      videoUrl: 'https://www.youtube.com/embed/o6pHqCymE1Q',
      benefits: [
        'اتصال شخصي لتقييم الحالة الصحية والغذائية بدقة.',
        'إعداد نظام غذائي مخصص بحسب الهدف ونمط الحياة.',
        'خطة رياضية مناسبة للمستوى البدني.',
        'تحديث النظام كل 10 أيام لضمان أفضل استجابة وتقدم مستمر.'
      ],
      benefitsEn: [
        'Personal call to assess your health and nutritional status.',
        'Custom diet plan based on your goals and lifestyle.',
        'Fitness plan suited to your physical level.',
        'Plan updates every 10 days for optimal progress.'
      ],
    },
    {
      slug: 'premium',
      title: 'تغيير خطير',
      titleEn: 'Serious Change',
      price: 99,
      videoUrl: 'https://www.youtube.com/embed/Cx2si3Au1W0',
      benefits: [
        'اتصال تفصيلي لتقييم الحالة الصحية والغذائية وتحديد الأهداف بدقة.',
        'إعداد نظام غذائي مخصص يتناسب مع طبيعة الجسم ونمط الحياة.',
        'خطة رياضية عملية قابلة للتطبيق حسب المستوى البدني.',
        'تحديث النظام كل 15 يوم لضمان استمرار التحفيز وتسريع النتائج.'
      ],
      benefitsEn: [
        'Detailed call to assess your health and set precise goals.',
        'Custom diet plan tailored to your body type and lifestyle.',
        'Practical fitness plan suitable for your level.',
        'Plan updates every 15 days to maintain motivation and accelerate results.'
      ],
    },
    {
      slug: 'ultimate',
      title: 'الرحلة',
      titleEn: 'The Journey',
      price: 299,
      videoUrl: 'https://www.youtube.com/embed/R5YITtsCV58',
      benefits: [
        'اتصال شهري للمتابعة وتقييم التقدم وتعديل المسار عند الحاجة.',
        'نظام غذائي مخصص ومتجدد بحسب المرحلة والتطور.',
        'تجديد النظام كل 15 يوم للحفاظ على التحفيز ومنع الثبات.',
        'خطة خاصة لشهر رمضان تراعي الصيام وتنظيم الوجبات.',
        'دعم مستمر لضمان استمرارية النتائج طوال العام.'
      ],
      benefitsEn: [
        'Monthly call for follow-up, progress evaluation, and course correction.',
        'Custom and evolving diet plan based on your phase and progress.',
        'Plan renewal every 15 days to maintain motivation and prevent plateaus.',
        'Special Ramadan plan considering fasting and meal organization.',
        'Continuous support to ensure lasting results throughout the year.'
      ],
    },
    {
      slug: 'consultation',
      title: 'جلسة الاستشارة الفردية',
      titleEn: 'Personal Consultation',
      price: 15,
      videoUrl: null,
      benefits: [
        'اتصال شخصي مباشر (40 دقيقة) لتقييم وتشخيص الحالة الصحية والغذائية بدقة.',
        'نظام غذائي مخصص مصمم تماماً بحسب هدفكِ، طبيعة جسمكِ، ونمط حياتكِ.',
        'خريطة طريق واضحة لتقدري تكملي لحالك بدون ضياع.',
      ],
      benefitsEn: [
        'Direct personal call (40 min) to assess your health and nutritional status.',
        'Custom diet plan designed for your goals, body type, and lifestyle.',
        'Clear roadmap so you can continue on your own without getting lost.',
      ],
    },
    {
      slug: 'book',
      title: 'تقليدية بس صحية',
      titleEn: 'Traditional but Healthy',
      price: 10,
      videoUrl: null,
      benefits: [
        'وصفات أكلات سورية أصيلة بتعديلات صحية ذكية.',
        'كل طبق محسوب الماكروز والسعرات الحرارية.',
        'كلي من أكل بيتك مع عيلتك وضلّي رشيقة.',
      ],
      benefitsEn: [
        'Authentic Syrian recipes with smart healthy adjustments.',
        'Every dish has calculated macros and calories.',
        'Eat your home food with your family and stay fit.',
      ],
    }
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        titleEn: p.titleEn,
        price: p.price,
        benefits: p.benefits,
        benefitsEn: p.benefitsEn,
        videoUrl: p.videoUrl,
      },
      create: p,
    });
  }

  console.log("Seeding CMS content...");

  const contentItems = [
    { key: 'about_title', value: 'أنا بتول.. وقبل ما أكون مدربتك، أنا كنت بمكانك بيوم من الأيام.' },
    { key: 'mission_title', value: 'رسالتي إلك: القصة مو "دايت"، القصة "حياة"' },
    { key: 'mission_intro', value: 'أنا هون لحتى غيّر الفكرة اللي ببالنا كلنا عن الدايت. هدفي ساعدك تبني نمط حياة صحي بيمشيك العمر كله.' },
    { key: 'vision_title', value: 'رؤيتي إلك: شو رح يتغير بحياتك بعد ما نشترك سوا؟' },
    { key: 'vision_intro', value: 'أنا ما رح أعطيكي ورقة وقلم وقلك كلي هاد واتركي هاد.. أنا رح كون معك لنبني سوا حياة جديدة.' },
    { key: 'insta_link', value: 'https://www.instagram.com/batool.home?igsh=MXhnY3R5eDh0d20wcQ==' },
    { key: 'fb_link', value: 'https://www.facebook.com/share/1HAy8RGqgV/' },
    { key: 'tiktok_link', value: 'https://www.tiktok.com/@batool_home?_r=1&_t=ZN-95w9fa2xqyZ' },
    { key: 'yt_link', value: 'https://youtube.com/@batoolhome6303?si=1u2ZLkH4PhLCTd30' },
  ];

  for (const item of contentItems) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
