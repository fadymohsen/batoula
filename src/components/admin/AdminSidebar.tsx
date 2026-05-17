'use client';

import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, List, Image as ImageIcon } from 'lucide-react';
import LogoutButton from './LogoutButton';
import AdminLangToggle from './AdminLangToggle';
import { useAdminLocale } from './AdminLocaleProvider';

export default function AdminSidebar() {
  const { t } = useAdminLocale();

  return (
    <aside className="w-64 bg-[#2c2825] text-white flex flex-col shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#b48a66]">{t.dashboard}</h2>
        <p className="text-sm text-gray-400 mt-1">{t.brand}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          <span>{t.overview}</span>
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
          <ShoppingCart className="w-5 h-5" />
          <span>{t.orders}</span>
        </Link>
        <Link href="/admin/plans" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
          <List className="w-5 h-5" />
          <span>{t.plans}</span>
        </Link>
        <Link href="/admin/cms" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#3d3733] transition-colors">
          <ImageIcon className="w-5 h-5" />
          <span>{t.content}</span>
        </Link>
      </nav>

      <div className="px-4 pb-2">
        <AdminLangToggle />
      </div>
      <div className="p-4 border-t border-[#3d3733]">
        <LogoutButton />
      </div>
    </aside>
  );
}
