import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const englishContent = [
    // Hero
    { key: "hero_title_1_en", value: "Fitness", type: "TEXT" },
    { key: "hero_title_highlight_en", value: "starts", type: "TEXT" },
    { key: "hero_title_2_en", value: "with a decision,", type: "TEXT" },
    { key: "hero_title_3_en", value: "and consistency makes the difference.", type: "TEXT" },
    { key: "hero_description_en", value: "My journey began with a personal experience of losing 27kg, and today I'm here to help you reach your goals using the best scientific and psychological methods.", type: "TEXT" },
    
    // About
    { key: "about_title_en", value: "From Experience to Science:", type: "TEXT" },
    { key: "about_title_highlight_en", value: "The Real", type: "TEXT" },
    { key: "about_title_end_en", value: "Transformation Story", type: "TEXT" },
    { key: "about_description_en", value: "I'm Batoul.. Before becoming your coach, I was once in your shoes. My journey started with excess weight and emotional exhaustion, but at a moment of honesty with myself, I made the decision.", type: "TEXT" },
    { key: "about_weight_loss_en", value: "27kg", type: "TEXT" },
    { key: "about_weight_loss_label_en", value: "Documented loss backed by science and experience", type: "TEXT" },

    // Stats
    { key: "stats_1_label_en", value: "Hours of intensive training", type: "TEXT" },
    { key: "stats_2_label_en", value: "Trainees achieved their goals", type: "TEXT" },
    { key: "stats_3_label_en", value: "kg of fat lost by my students", type: "TEXT" },

    // Mission
    { key: "mission_quote_en", value: "My message to you: It's not about dieting, it's about living", type: "TEXT" },
    { key: "mission_description_en", value: "I'm here to change the idea we all have about dieting. Dieting is not a punishment, nor is it a temporary period of deprivation that we finish and go back to our old habits. My goal is to help you build a healthy lifestyle that lasts a lifetime.", type: "TEXT" },

    // Transformation
    { key: "trans_title_en", value: "Real Results", type: "TEXT" },
    { key: "trans_title_highlight_en", value: "Inspiring Success Stories", type: "TEXT" },
    { key: "trans_description_en", value: "Here we see the fruits of hard work and commitment. Real photos of trainees who changed their lives for the better.", type: "TEXT" },

    // FAQ
    { key: "faq_1_q_en", value: "How many kg can I lose per month?", type: "TEXT" },
    { key: "faq_1_a_en", value: "A healthy rate is 4 to 6 kg per month, depending on your body and commitment. We focus on real fat loss, not just water.", type: "TEXT" },
    { key: "faq_2_q_en", value: "When will I see results?", type: "TEXT" },
    { key: "faq_2_a_en", value: "Every body is different, but most trainees notice changes in energy and measurements within the first two weeks.", type: "TEXT" },
  ];

  console.log("Adding English translations to CMS...");

  for (const item of englishContent) {
    await prisma.content.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: {
        key: item.key,
        value: item.value,
        type: item.type as any,
      },
    });
  }

  console.log("English translations added successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
