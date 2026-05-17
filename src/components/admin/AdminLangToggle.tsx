'use client';

import { useAdminLocale } from './AdminLocaleProvider';
import { Globe } from 'lucide-react';

export default function AdminLangToggle() {
  const { locale, toggle } = useAdminLocale();
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#3d3733] transition-colors text-gray-400 hover:text-white text-sm"
    >
      <Globe size={16} />
      <span className="font-bold">{locale === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}
