import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import PlansAdmin from "./PlansAdmin";

async function savePlan(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const titleEn = formData.get("titleEn") as string;
  const price = parseFloat(formData.get("price") as string);
  const benefits = (formData.get("benefits") as string).split("\n").filter(b => b.trim() !== "");
  const benefitsEn = (formData.get("benefitsEn") as string).split("\n").filter(b => b.trim() !== "");
  const slug = formData.get("slug") as string;
  const videoUrl = formData.get("videoUrl") as string;

  if (id) {
    await prisma.plan.update({
      where: { id },
      data: { title, titleEn: titleEn || null, price, benefits, benefitsEn, slug, videoUrl: videoUrl || null },
    });
  } else {
    await prisma.plan.create({
      data: { title, titleEn: titleEn || null, price, benefits, benefitsEn, slug, videoUrl: videoUrl || null },
    });
  }
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  redirect("/admin/plans?success=" + (id ? "updated" : "created"));
}

async function deletePlan(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  try {
    await prisma.plan.delete({ where: { id } });
  } catch {
    redirect("/admin/plans?error=delete_failed");
  }
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  redirect("/admin/plans?success=deleted");
}

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" },
  });

  const serialized = plans.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <PlansAdmin plans={serialized} saveAction={savePlan} deleteAction={deletePlan} />;
}
