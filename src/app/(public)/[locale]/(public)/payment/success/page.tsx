'use client';

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleContext';

export default function PaymentSuccessPage() {
  const { locale, dict } = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] flex justify-center items-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0eadd] text-center py-12 animate-in zoom-in-95 duration-500">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">{dict.checkout.successTitle}</h1>
        <p className="text-lg text-[#6b625a] mb-8">
          {dict.checkout.successCard}
        </p>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="bg-[#2c2825] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a1715] transition-colors"
        >
          {dict.checkout.backHome}
        </button>
      </div>
    </div>
  );
}
