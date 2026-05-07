import prisma from "@/lib/prisma";
import { Edit, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

async function savePlan(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const benefits = (formData.get("benefits") as string).split("\n").filter(b => b.trim() !== "");
  const slug = formData.get("slug") as string;
  const videoUrl = formData.get("videoUrl") as string;

  if (id) {
    await prisma.plan.update({
      where: { id },
      data: { title, price, benefits, slug, videoUrl },
    });
  } else {
    await prisma.plan.create({
      data: { title, price, benefits, slug, videoUrl },
    });
  }
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

async function deletePlan(id: string) {
  "use server";
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2c2825]">إدارة الباقات</h1>
          <p className="text-[#8a7f76] mt-1">تعديل الأسعار والمزايا لكل باقة</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Plans List */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <p className="text-sm text-[#b48a66] font-bold">${plan.price}</p>
                  <p className="text-xs text-gray-400 mt-1">Slug: {plan.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#b48a66] transition-colors">
                    <Edit size={18} />
                  </button>
                  <form action={deletePlan.bind(null, plan.id)}>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="space-y-2">
                {plan.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-[#b48a66]" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={20} className="text-[#b48a66]" />
            إضافة / تعديل باقة
          </h2>
          <form action={savePlan} className="space-y-4">
            <input type="hidden" name="id" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">اسم الباقة</label>
                <input name="title" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#b48a66] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">السعر ($)</label>
                <input name="price" type="number" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#b48a66] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">الرابط (Slug)</label>
              <input name="slug" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#b48a66] outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">رابط الفيديو (اختياري)</label>
              <input name="videoUrl" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#b48a66] outline-none text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">المزايا (سطر لكل ميزة)</label>
              <textarea name="benefits" rows={6} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#b48a66] outline-none" />
            </div>
            <button type="submit" className="w-full bg-[#2c2825] text-white py-3 rounded-xl font-bold hover:bg-[#1a1715] transition-colors mt-2">
              حفظ الباقة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
