import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const initialContent = [
    // Hero
    { key: "hero_badge_1", value: "كوتش تغذية معتمدة", type: "TEXT" },
    { key: "hero_badge_2", value: "ماجستير أمراض مزمنة", type: "TEXT" },
    { key: "hero_badge_3", value: "Life Coach", type: "TEXT" },
    { key: "hero_title_1", value: "القصة مو \"دايت\"", type: "TEXT" },
    { key: "hero_title_2", value: "القصة \"حياة\"", type: "TEXT" },
    { key: "hero_description", value: "أنا هون لحتى غيّر الفكرة اللي ببالنا كلنا عن الدايت. الدايت مو عقوبة، ولا هو فترة حرمان مؤقتة — هدفي ساعدك تبني نمط حياة صحي بيمشيك العمر كله.", type: "TEXT" },
    { key: "hero_image", value: "/coach-batoula.jpg", type: "IMAGE" },
    
    // About
    { key: "about_title", value: "أنا بتول.. وقبل ما أكون مدربتك، كنت بمكانك.", type: "TEXT" },
    { key: "about_description", value: "كنت عم عاني من زيادة الوزن، وجربت كل أنواع الدايت... استمريت 6 شهور ونزلت 27 كيلو دهون! وثبّتت وزني بكل سهولة — لأني ما كنت عاملة دايت، كنت عم عيش نمط حياة جديد.", type: "TEXT" },
    { key: "about_image", value: "/content/_.jpg (12).jpeg", type: "IMAGE" },

    // Stats
    { key: "stats_1_label", value: "ساعات تدريب", type: "TEXT" },
    { key: "stats_1_value", value: "+2000", type: "TEXT" },
    { key: "stats_2_label", value: "متدربة ناجحة", type: "TEXT" },
    { key: "stats_2_value", value: "+500", type: "TEXT" },
    { key: "stats_3_label", value: "كيلو دهون مفقودة", type: "TEXT" },
    { key: "stats_3_value", value: "+3500", type: "TEXT" },

    // Mission
    { key: "mission_title", value: "رسالتي وأهدافي.. ليش أنا هون؟", type: "TEXT" },
    { key: "mission_item_1_title", value: "نوقف هوس الميزان", type: "TEXT" },
    { key: "mission_item_1_desc", value: "نتعلم كيف نقرأ أجسامنا ونفهم احتياجاتها الحقيقية بعيداً عن الأرقام.", type: "TEXT" },
    { key: "mission_item_2_title", value: "الاستمرارية هي السر", type: "TEXT" },
    { key: "mission_item_2_desc", value: "بناء عادات بتعيش معك العمر كله، مو بس لفترة الدايت.", type: "TEXT" },
    { key: "mission_item_3_title", value: "جودة الحياة أولاً", type: "TEXT" },
    { key: "mission_item_3_desc", value: "تكوني بكامل طاقتك ونشاطك وصحتك النفسية خلال رحلة التغيير.", type: "TEXT" },

    // Transformation
    { key: "trans_title", value: "النتائج الحقيقية.. قصص نجاح ملهمة", type: "TEXT" },
    { key: "trans_description", value: "هون بنشوف ثمرة التعب والالتزام.. صور حقيقية لمتدربات غيروا حياتهم للأفضل.", type: "TEXT" },
    { key: "trans_image", value: "/content/_.jpg (11).jpeg", type: "IMAGE" },

    // FAQ
    { key: "faq_1_q", value: "هل البرنامج مناسب للمرضعات؟", type: "TEXT" },
    { key: "faq_1_a", value: "نعم، يتم تصميم النظام الغذائي لضمان حصولك وحصول طفلك على كافة العناصر الغذائية اللازمة.", type: "TEXT" },
    { key: "faq_2_q", value: "متى تظهر النتائج الأولى؟", type: "TEXT" },
    { key: "faq_2_a", value: "تختلف من جسم لآخر، لكن معظم المتدربات يلاحظن فرقاً في النشاط والمقاسات خلال أول أسبوعين.", type: "TEXT" },
  ];

  console.log("Seeding CMS content...");

  for (const item of initialContent) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: {},
      create: {
        key: item.key,
        value: item.value,
        type: item.type as any,
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
