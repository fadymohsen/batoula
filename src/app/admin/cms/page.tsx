import prisma from "@/lib/prisma";
import { Layout } from "lucide-react";
import { revalidatePath } from "next/cache";
import CMSItemForm from "@/components/admin/CMSItemForm";

const CMS_CONFIG: Record<string, { label: string; group: string; icon: string }> = {
  // Hero
  hero_badge_1: { label: "الشارة الأولى (Hero)", group: "الهيرو", icon: "info" },
  hero_badge_2: { label: "الشارة الثانية (Hero)", group: "الهيرو", icon: "info" },
  hero_badge_3: { label: "الشارة الثالثة (Hero)", group: "الهيرو", icon: "info" },
  hero_title_1: { label: "العنوان الرئيسي الأول", group: "الهيرو", icon: "type" },
  hero_title_2: { label: "العنوان الرئيسي الثاني (ملون)", group: "الهيرو", icon: "type" },
  hero_description: { label: "وصف الهيرو", group: "الهيرو", icon: "type" },
  hero_image: { label: "صورة الهيرو", group: "الهيرو", icon: "image" },
  
  // About
  about_title: { label: "عنوان قسم عن المدربة", group: "عن بتول", icon: "user" },
  about_description: { label: "نص قصة المدربة", group: "عن بتول", icon: "type" },
  about_image: { label: "صورة قسم عن المدربة", group: "عن بتول", icon: "image" },

  // Stats
  stats_1_label: { label: "تسمية الإحصائية 1", group: "الإحصائيات", icon: "info" },
  stats_1_value: { label: "قيمة الإحصائية 1", group: "الإحصائيات", icon: "type" },
  stats_2_label: { label: "تسمية الإحصائية 2", group: "الإحصائيات", icon: "info" },
  stats_2_value: { label: "قيمة الإحصائية 2", group: "الإحصائيات", icon: "type" },
  stats_3_label: { label: "تسمية الإحصائية 3", group: "الإحصائيات", icon: "info" },
  stats_3_value: { label: "قيمة الإحصائية 3", group: "الإحصائيات", icon: "type" },

  // Mission
  mission_title: { label: "عنوان قسم الرسالة", group: "الرسالة والأهداف", icon: "type" },
  mission_item_1_title: { label: "هدف 1 - عنوان", group: "الرسالة والأهداف", icon: "type" },
  mission_item_1_desc: { label: "هدف 1 - وصف", group: "الرسالة والأهداف", icon: "type" },
  mission_item_2_title: { label: "هدف 2 - عنوان", group: "الرسالة والأهداف", icon: "type" },
  mission_item_2_desc: { label: "هدف 2 - وصف", group: "الرسالة والأهداف", icon: "type" },
  mission_item_3_title: { label: "هدف 3 - عنوان", group: "الرسالة والأهداف", icon: "type" },
  mission_item_3_desc: { label: "هدف 3 - وصف", group: "الرسالة والأهداف", icon: "type" },

  // Transformation
  trans_title: { label: "عنوان قسم النتائج", group: "النتائج والتحول", icon: "type" },
  trans_description: { label: "وصف قسم النتائج", group: "النتائج والتحول", icon: "type" },
  trans_image: { label: "صورة التحول (قبل وبعد)", group: "النتائج والتحول", icon: "image" },

  // FAQ (Simplified for now as key-value pairs)
  faq_1_q: { label: "سؤال 1", group: "الأسئلة الشائعة", icon: "info" },
  faq_1_a: { label: "جواب 1", group: "الأسئلة الشائعة", icon: "type" },
  faq_2_q: { label: "سؤال 2", group: "الأسئلة الشائعة", icon: "info" },
  faq_2_a: { label: "جواب 2", group: "الأسئلة الشائعة", icon: "type" },
};

async function saveContent(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const value = formData.get("value") as string;

  await prisma.content.update({
    where: { id },
    data: { value },
  });
  
  revalidatePath("/");
  revalidatePath("/admin/cms");
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
    const config = CMS_CONFIG[item.key] || { label: item.key, group: "عام", icon: Layout };
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
