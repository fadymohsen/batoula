import prisma from "@/lib/prisma";
import { Layout } from "lucide-react";
import { revalidatePath } from "next/cache";
import CMSItemForm from "@/components/admin/CMSItemForm";

const CMS_CONFIG: Record<string, { label: string; group: string; icon: string }> = {
  // Hero
  hero_title_1: { label: "العنوان الرئيسي 1 (عربي)", group: "الهيرو", icon: "type" },
  hero_title_1_en: { label: "Main Title 1 (English)", group: "الهيرو", icon: "type" },
  hero_title_highlight: { label: "الكلمة المميزة (عربي)", group: "الهيرو", icon: "type" },
  hero_title_highlight_en: { label: "Highlight Word (English)", group: "الهيرو", icon: "type" },
  hero_title_2: { label: "العنوان الرئيسي 2 (عربي)", group: "الهيرو", icon: "type" },
  hero_title_2_en: { label: "Main Title 2 (English)", group: "الهيرو", icon: "type" },
  hero_title_3: { label: "العنوان الرئيسي 3 (عربي)", group: "الهيرو", icon: "type" },
  hero_title_3_en: { label: "Main Title 3 (English)", group: "الهيرو", icon: "type" },
  hero_description: { label: "وصف الهيرو (عربي)", group: "الهيرو", icon: "type" },
  hero_description_en: { label: "Hero Description (English)", group: "الهيرو", icon: "type" },
  hero_image: { label: "صورة الهيرو", group: "الهيرو", icon: "image" },
  
  // About
  about_title: { label: "عنوان قصة بتول (عربي)", group: "عن بتول", icon: "user" },
  about_title_en: { label: "About Title (English)", group: "عن بتول", icon: "user" },
  about_title_highlight: { label: "الكلمة المميزة - عن بتول (عربي)", group: "عن بتول", icon: "type" },
  about_title_highlight_en: { label: "Highlight Word - About (English)", group: "عن بتول", icon: "type" },
  about_title_end: { label: "نهاية العنوان - عن بتول (عربي)", group: "عن بتول", icon: "type" },
  about_title_end_en: { label: "Title End - About (English)", group: "عن بتول", icon: "type" },
  about_description: { label: "نص القصة (عربي)", group: "عن بتول", icon: "type" },
  about_description_en: { label: "Story Text (English)", group: "عن بتول", icon: "type" },
  about_image: { label: "صورة عن بتول", group: "عن بتول", icon: "image" },

  // Stats
  stats_1_label: { label: "تسمية الإحصائية 1 (عربي)", group: "الإحصائيات", icon: "info" },
  stats_1_label_en: { label: "Stat 1 Label (English)", group: "الإحصائيات", icon: "info" },
  stats_1_value: { label: "قيمة الإحصائية 1", group: "الإحصائيات", icon: "type" },
  stats_2_label: { label: "تسمية الإحصائية 2 (عربي)", group: "الإحصائيات", icon: "info" },
  stats_2_label_en: { label: "Stat 2 Label (English)", group: "الإحصائيات", icon: "info" },
  stats_2_value: { label: "قيمة الإحصائية 2", group: "الإحصائيات", icon: "type" },
  stats_3_label: { label: "تسمية الإحصائية 3 (عربي)", group: "الإحصائيات", icon: "info" },
  stats_3_label_en: { label: "Stat 3 Label (English)", group: "الإحصائيات", icon: "info" },
  stats_3_value: { label: "قيمة الإحصائية 3", group: "الإحصائيات", icon: "type" },

  // Mission
  mission_quote: { label: "الاقتباس (عربي)", group: "الرسالة", icon: "type" },
  mission_quote_en: { label: "Quote (English)", group: "الرسالة", icon: "type" },
  mission_description: { label: "الوصف (عربي)", group: "الرسالة", icon: "type" },
  mission_description_en: { label: "Description (English)", group: "الرسالة", icon: "type" },

  // Transformation
  trans_title: { label: "عنوان النتائج (عربي)", group: "النتائج", icon: "type" },
  trans_title_en: { label: "Results Title (English)", group: "النتائج", icon: "type" },
  trans_title_highlight: { label: "الكلمة المميزة - نتائج (عربي)", group: "النتائج", icon: "type" },
  trans_title_highlight_en: { label: "Highlight Word - Results (English)", group: "النتائج", icon: "type" },
  trans_description: { label: "وصف النتائج (عربي)", group: "النتائج", icon: "type" },
  trans_description_en: { label: "Results Description (English)", group: "النتائج", icon: "type" },
  trans_image: { label: "صورة التحول", group: "النتائج", icon: "image" },
};

async function saveContent(formData: FormData) {
  "use server";
  try {
    const id = formData.get("id") as string;
    const value = formData.get("value") as string;

    if (!id) throw new Error("Missing ID");

    await prisma.content.update({
      where: { id },
      data: { value },
    });
    
    // Revalidate everything to ensure the homepage and admin panel are updated
    revalidatePath("/", "layout");
    revalidatePath("/admin/cms");
    
    return { success: true };
  } catch (error) {
    console.error("Save failed:", error);
    throw error;
  }
}

export default async function AdminCMSPage() {
  const contents = await prisma.content.findMany({
    orderBy: { key: "asc" },
  });

  // Sanitize for serialization (Next.js requirement)
  const sanitizedContents = contents.map(item => ({
    id: item.id,
    key: item.key,
    value: item.value,
    type: item.type,
  }));

  const groupedContent = sanitizedContents.reduce((acc, item) => {
    const config = CMS_CONFIG[item.key] || { label: item.key, group: "عام", icon: "layout" };
    if (!acc[config.group]) acc[config.group] = [];
    acc[config.group].push({ ...item, config });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-[#2c2825]">إدارة المحتوى (CMS)</h1>
        <p className="text-[#8a7f76] mt-1">تحكم في نصوص وصور الموقع بسهولة من مكان واحد</p>
      </div>

      <div className="space-y-16">
        {Object.entries(groupedContent).map(([groupName, items]) => (
          <section key={groupName} className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#b48a66]/10 flex items-center justify-center text-[#b48a66]">
                <Layout size={20} />
              </div>
              <h2 className="text-xl font-bold text-[#2c2825]">{groupName}</h2>
            </div>

            <div className="grid gap-6">
              {items.map((item) => (
                <CMSItemForm key={item.id} item={item} saveAction={saveContent} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
