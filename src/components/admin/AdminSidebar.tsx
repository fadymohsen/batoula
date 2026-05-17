'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, List, Image as ImageIcon, Menu, X } from 'lucide-react';
import LogoutButton from './LogoutButton';
import AdminLangToggle from './AdminLangToggle';
import { useAdminLocale } from './AdminLocaleProvider';

export default function AdminSidebar() {
  const { t, locale } = useAdminLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t.overview },
    { href: '/admin/orders', icon: ShoppingCart, label: t.orders },
    { href: '/admin/plans', icon: List, label: t.plans },
    { href: '/admin/cms', icon: ImageIcon, label: t.content },
  ];

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href);

  const sideClass = locale === 'ar' ? 'right-0' : 'left-0';
  const hiddenTransform = locale === 'ar' ? 'translate-x-full' : '-translate-x-full';

  return (
    <>
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#2c2825] text-white flex items-center justify-between px-4 shadow-md">
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold text-[#b48a66]">{t.dashboard}</span>
          <span className="text-[10px] text-gray-400">{t.brand}</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="p-2 rounded-lg hover:bg-[#3d3733] active:bg-[#3d3733] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 ${sideClass} z-50 w-72 max-w-[85vw] md:w-64 md:max-w-none bg-[#2c2825] text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : hiddenTransform} md:translate-x-0`}
        aria-hidden={!open ? undefined : false}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#b48a66]">{t.dashboard}</h2>
            <p className="text-sm text-gray-400 mt-1">{t.brand}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="md:hidden p-2 rounded-lg hover:bg-[#3d3733] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-[#3d3733] text-white' : 'text-gray-200 hover:bg-[#3d3733]'}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-2">
          <AdminLangToggle />
        </div>
        <div className="p-4 border-t border-[#3d3733]">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
