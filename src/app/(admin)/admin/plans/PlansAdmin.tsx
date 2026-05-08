"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Edit, Plus, Trash2, CheckCircle2, X, AlertTriangle, Check, Save } from "lucide-react";

type Plan = {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  price: number;
  benefits: string[];
  benefitsEn: string[];
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function PlansAdmin({
  plans,
  saveAction,
  deleteAction,
}: {
  plans: Plan[];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "created") {
      setToast({ type: "success", message: "تم إضافة الباقة بنجاح / Plan added successfully" });
      setEditingPlan(null);
    } else if (success === "updated") {
      setToast({ type: "success", message: "تم تحديث الباقة بنجاح / Plan updated successfully" });
      setEditingPlan(null);
    } else if (success === "deleted") {
      setToast({ type: "success", message: "تم حذف الباقة بنجاح / Plan deleted successfully" });
    } else if (error === "delete_failed") {
      setToast({ type: "error", message: "فشل حذف الباقة — قد تكون مرتبطة بطلبات / Cannot delete — plan has linked orders" });
    }
    if (success || error) {
      window.history.replaceState(null, "", "/admin/plans");
    }
  }, [searchParams]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  function handleEdit(plan: Plan) {
    setEditingPlan(plan);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleCancelEdit() {
    setEditingPlan(null);
    const form = formRef.current?.querySelector("form") as HTMLFormElement | null;
    form?.reset();
  }

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#b48a66] focus:border-[#b48a66] outline-none transition-colors";

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold transition-all animate-in fade-in slide-in-from-top-4 ${
          toast.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
          {toast.message}
          <button onClick={() => setToast(null)} className="ms-2 opacity-50 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-[#2c2825]">إدارة الباقات</h1>
        <p className="text-[#8a7f76] mt-1">تعديل الأسعار والمزايا لكل باقة — عربي وإنجليزي</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Plans List */}
        <div className="space-y-4 order-2 lg:order-1">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                editingPlan?.id === plan.id ? "border-[#b48a66] ring-2 ring-[#b48a66]/20" : "border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-right flex-1">
                  <h3 className="text-xl font-bold text-[#2c2825]">{plan.title}</h3>
                  {plan.titleEn && (
                    <p className="text-sm text-gray-400 font-medium mt-0.5" dir="ltr">{plan.titleEn}</p>
                  )}
                  <p className="text-sm text-[#b48a66] font-bold mt-1">${plan.price}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Slug: {plan.slug}</p>
                </div>
                <div className="flex gap-1 ms-4">
                  <button
                    onClick={() => handleEdit(plan)}
                    className={`p-2 rounded-lg transition-colors ${
                      editingPlan?.id === plan.id
                        ? "bg-[#b48a66] text-white"
                        : "text-gray-400 hover:text-[#b48a66] hover:bg-[#b48a66]/10"
                    }`}
                    title="تعديل"
                  >
                    <Edit size={18} />
                  </button>
                  {deleteConfirm === plan.id ? (
                    <div className="flex items-center gap-1">
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={plan.id} />
                        <button
                          type="submit"
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                          title="تأكيد الحذف"
                        >
                          <Check size={18} />
                        </button>
                      </form>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="إلغاء"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(plan.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Benefits - bilingual */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">عربي</p>
                  <div className="space-y-1.5">
                    {plan.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={14} className="text-[#b48a66] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {plan.benefitsEn && plan.benefitsEn.length > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2">English</p>
                    <div className="space-y-1.5" dir="ltr">
                      {plan.benefitsEn.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <CheckCircle2 size={14} className="text-[#b48a66]/50 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {plan.videoUrl && (
                <p className="text-xs text-gray-300 mt-3 truncate" dir="ltr">Video: {plan.videoUrl}</p>
              )}
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-8 order-1 lg:order-2" ref={formRef}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {editingPlan ? (
                <>
                  <Edit size={20} className="text-[#b48a66]" />
                  تعديل باقة: {editingPlan.title}
                </>
              ) : (
                <>
                  <Plus size={20} className="text-[#b48a66]" />
                  إضافة باقة جديدة
                </>
              )}
            </h2>
            {editingPlan && (
              <button
                onClick={handleCancelEdit}
                className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                <X size={16} />
                إلغاء التعديل
              </button>
            )}
          </div>

          <form action={saveAction} className="space-y-5">
            <input type="hidden" name="id" value={editingPlan?.id || ""} />

            {/* Arabic Title + English Title */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-3">
                <p className="text-xs font-bold text-[#b48a66] uppercase tracking-wider">عربي — Arabic</p>
                <div>
                  <label className="block text-sm font-bold mb-1">اسم الباقة</label>
                  <input
                    name="title"
                    required
                    defaultValue={editingPlan?.title || ""}
                    key={`title-${editingPlan?.id || "new"}`}
                    className={inputClass}
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">المزايا (سطر لكل ميزة)</label>
                  <textarea
                    name="benefits"
                    rows={5}
                    required
                    defaultValue={editingPlan?.benefits.join("\n") || ""}
                    key={`benefits-${editingPlan?.id || "new"}`}
                    className={inputClass}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">English — إنجليزي</p>
                <div>
                  <label className="block text-sm font-bold mb-1 text-left" dir="ltr">Plan Name</label>
                  <input
                    name="titleEn"
                    defaultValue={editingPlan?.titleEn || ""}
                    key={`titleEn-${editingPlan?.id || "new"}`}
                    className={inputClass}
                    dir="ltr"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-left" dir="ltr">Benefits (one per line)</label>
                  <textarea
                    name="benefitsEn"
                    rows={5}
                    defaultValue={editingPlan?.benefitsEn?.join("\n") || ""}
                    key={`benefitsEn-${editingPlan?.id || "new"}`}
                    className={inputClass}
                    dir="ltr"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Shared fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">السعر ($)</label>
                <input
                  name="price"
                  type="number"
                  required
                  defaultValue={editingPlan?.price || ""}
                  key={`price-${editingPlan?.id || "new"}`}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">الرابط (Slug)</label>
                <input
                  name="slug"
                  required
                  defaultValue={editingPlan?.slug || ""}
                  key={`slug-${editingPlan?.id || "new"}`}
                  className={inputClass + " text-left"}
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">رابط الفيديو (اختياري)</label>
              <input
                name="videoUrl"
                defaultValue={editingPlan?.videoUrl || ""}
                key={`videoUrl-${editingPlan?.id || "new"}`}
                className={inputClass + " text-left"}
                dir="ltr"
                placeholder="https://www.youtube.com/embed/..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#2c2825] text-white py-3.5 rounded-xl font-bold hover:bg-[#1a1715] transition-colors mt-2 shadow-lg"
            >
              <Save size={18} />
              {editingPlan ? "حفظ التعديلات / Save Changes" : "إضافة الباقة / Add Plan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
