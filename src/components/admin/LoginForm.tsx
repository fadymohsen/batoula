"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("بيانات الدخول غير صحيحة");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center border border-red-100 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-bold mb-2 text-[#2c2825]">البريد الإلكتروني</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] outline-none text-left"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-[#2c2825]">كلمة المرور</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] outline-none text-left"
          dir="ltr"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#b48a66] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9d7756] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="animate-spin" size={20} />}
        {loading ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
}
