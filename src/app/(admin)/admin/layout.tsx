import { auth } from "@/auth";
import { Cairo } from "next/font/google";
import { AdminLocaleProvider } from "@/components/admin/AdminLocaleProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "../../globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} min-h-screen bg-gray-50`}>
        <AdminLocaleProvider>
          {!session ? (
            <main className="flex-1">
              {children}
            </main>
          ) : (
            <div className="flex min-h-screen">
              <AdminSidebar />
              <main className="flex-1 min-w-0 p-4 pt-20 md:p-8">
                {children}
              </main>
            </div>
          )}
        </AdminLocaleProvider>
      </body>
    </html>
  );
}
