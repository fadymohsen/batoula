import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, List, Image as ImageIcon, LogOut } from "lucide-react";
import { signOut } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Basic check for admin layout, login page will not use this layout if structured correctly,
  // but since we are putting it in /admin, let's just bypass auth for the login page
  // Wait, Next.js nested layouts: to exclude /login from the admin layout, we should put it outside,
  // or handle it in the layout. Let's just assume this layout wraps everything in /admin.
  // We'll redirect to /login if no session, but /login itself shouldn't redirect infinitely.
  // Actually, better to use middleware, but for simplicity, we do it here and check pathname.
  // It's cleaner to have the layout render a sidebar if logged in.
  
  if (!session) {
    // We cannot access pathname easily in a server component layout without headers trick.
    // Instead of redirecting here, let's just return children if no session (the login page will render).
    // The actual pages in /admin will protect themselves.
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2c2825] text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#b48a66]">لوحة التحكم</h2>
          <p className="text-sm text-gray-400 mt-1">كوتش بتولة</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>نظرة عامة</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span>الطلبات</span>
          </Link>
          <Link href="/admin/plans" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
            <List className="w-5 h-5" />
            <span>الخطط والاشتراكات</span>
          </Link>
          <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span>المحتوى والملفات</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#3d3733]">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
