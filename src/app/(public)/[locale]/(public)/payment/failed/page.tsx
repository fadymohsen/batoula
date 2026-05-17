'use client';

import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleContext';

export default function PaymentFailedPage() {
  const { locale, dict } = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] flex justify-center items-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0eadd] text-center py-12 animate-in zoom-in-95 duration-500">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">{dict.payment?.failedTitle || 'Payment Failed'}</h1>
        <p className="text-lg text-[#6b625a] mb-8">
          {dict.payment?.failedDesc || 'Something went wrong with your payment. Please try again or choose a different payment method.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="bg-[#b48a66] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#9d7756] transition-colors"
          >
            {dict.payment?.tryAgain || 'Try Again'}
          </button>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="bg-[#f5f1eb] text-[#8a7f76] px-8 py-4 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors"
          >
            {dict.checkout.backHome}
          </button>
        </div>
      </div>
    </div>
  );
}
