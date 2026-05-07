"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>تسجيل الخروج</span>
    </button>
  );
}
