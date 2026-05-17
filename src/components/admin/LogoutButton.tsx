"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useAdminLocale } from "./AdminLocaleProvider";

export default function LogoutButton() {
  const { t } = useAdminLocale();
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>{t.logout}</span>
    </button>
  );
}
