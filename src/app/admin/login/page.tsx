import { signIn } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#faf8f5]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0eadd]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#b48a66] mb-2">تسجيل الدخول</h1>
          <p className="text-[#8a7f76]">لوحة تحكم كوتش بتولة</p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-bold mb-2 text-[#2c2825]">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] outline-none text-left"
              dir="ltr"
              defaultValue="admin@admin.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#2c2825]">كلمة المرور</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] outline-none text-left"
              dir="ltr"
              defaultValue="admin"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#b48a66] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9d7756] transition-colors"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
