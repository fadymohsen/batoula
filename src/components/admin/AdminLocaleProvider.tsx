'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { adminDict, type AdminLocale } from '@/lib/admin-i18n';

type AdminDictValues = { [K in keyof typeof adminDict.ar]: string };

const AdminLocaleContext = createContext<{
  locale: AdminLocale;
  t: AdminDictValues;
  toggle: () => void;
}>({
  locale: 'ar',
  t: adminDict.ar,
  toggle: () => {},
});

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<AdminLocale>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('admin_locale') as AdminLocale;
    if (saved === 'en' || saved === 'ar') setLocale(saved);
  }, []);

  const toggle = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('admin_locale', next);
  };

  return (
    <AdminLocaleContext.Provider value={{ locale, t: adminDict[locale], toggle }}>
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
        {children}
      </div>
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  return useContext(AdminLocaleContext);
}
