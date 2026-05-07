import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

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

        <LoginForm />
      </div>
    </div>
  );
}
