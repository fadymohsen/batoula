'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CreditCard, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';

export default function CheckoutPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = use(params);
  const { locale, dict } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: 'CREDIT_CARD',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planDetails = slug === 'premium' ? { id: '2', title: dict.plans.plan2.name, price: 120 } : { id: '1', title: dict.plans.plan1.name, price: 50 };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.customerName && formData.customerEmail && formData.customerPhone) {
      setStep(2);
    } else if (step === 2) {
      if (formData.paymentMethod === 'CREDIT_CARD') {
        processOrder(null);
      } else {
        setStep(3);
      }
    }
  };

  const processOrder = async (receiptUrl: string | null) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          planId: planDetails.id,
          receiptUrl
        }),
      });

      if (response.ok) {
        setStep(4);
      } else {
        alert(dict.checkout.orderError);
      }
    } catch (error) {
      console.error(error);
      alert(dict.checkout.serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!file) {
      alert(dict.checkout.uploadFirst);
      return;
    }

    setLoading(true);
    try {
      const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      const uploadData = await uploadRes.json();

      if (uploadData.url) {
        await processOrder(uploadData.url);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert(dict.checkout.uploadError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0eadd]">

        {step < 4 && (
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-[#f0eadd] -z-10 -translate-y-1/2"></div>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= s ? 'bg-[#b48a66] text-white' : 'bg-white border-2 border-[#f0eadd] text-[#8a7f76]'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{dict.checkout.step1Title}</h1>
              <p className="text-[#8a7f76]">{dict.checkout.step1Desc}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">{dict.checkout.fullName}</label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">{dict.checkout.email}</label>
                <input
                  required
                  type="email"
                  className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none text-left"
                  dir="ltr"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">{dict.checkout.phone}</label>
                <input
                  required
                  type="tel"
                  placeholder={dict.checkout.phonePlaceholder}
                  className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none text-left"
                  dir="ltr"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#2c2825] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a1715] transition-colors mt-8">
              {dict.checkout.continuePayment}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{dict.checkout.step2Title}</h1>
              <p className="text-[#8a7f76]">{dict.checkout.amountDue} {planDetails.price}$</p>
            </div>

            <div className="space-y-4">
              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'CREDIT_CARD' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="CREDIT_CARD" checked={formData.paymentMethod === 'CREDIT_CARD'} onChange={() => setFormData({...formData, paymentMethod: 'CREDIT_CARD'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#b48a66]" />
                    <span className="font-bold text-lg">{dict.checkout.creditCard}</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'INSTAPAY' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="INSTAPAY" checked={formData.paymentMethod === 'INSTAPAY'} onChange={() => setFormData({...formData, paymentMethod: 'INSTAPAY'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#b48a66]" />
                    <span className="font-bold text-lg">{dict.checkout.bankTransfer}</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'SHAMCASH' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="SHAMCASH" checked={formData.paymentMethod === 'SHAMCASH'} onChange={() => setFormData({...formData, paymentMethod: 'SHAMCASH'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#b48a66]" />
                    <span className="font-bold text-lg">{dict.checkout.shamCash}</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#f5f1eb] text-[#8a7f76] py-4 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors">
                {dict.checkout.back}
              </button>
              <button type="submit" disabled={loading} className="w-2/3 bg-[#2c2825] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a1715] transition-colors flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : formData.paymentMethod === 'CREDIT_CARD' ? dict.checkout.payNow : dict.checkout.continue}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">{dict.checkout.step3Title}</h1>
              <p className="text-[#8a7f76]">{dict.checkout.step3Desc} {planDetails.price}$ {dict.checkout.step3DescEnd}</p>
            </div>

            <div className="bg-[#f5f1eb] p-6 rounded-xl border border-[#e8dfd1] mb-6">
              {formData.paymentMethod === 'INSTAPAY' ? (
                <div className="text-center space-y-2">
                  <p className="font-bold text-sm text-[#8a7f76]">{dict.checkout.instaPayLabel}</p>
                  <p className="text-xl font-bold" dir="ltr">+20 100 123 4567</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <p className="font-bold text-sm text-[#8a7f76]">{dict.checkout.shamCashLabel}</p>
                  <p className="text-xl font-bold" dir="ltr">0933 123 456</p>
                </div>
              )}
            </div>

            <div
              className="border-2 border-dashed border-[#b48a66]/40 bg-[#b48a66]/5 rounded-2xl p-8 text-center cursor-pointer hover:bg-[#b48a66]/10 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-[#b48a66] mx-auto mb-4" />
              {file ? (
                <p className="font-bold text-green-700">{file.name}</p>
              ) : (
                <>
                  <p className="font-bold text-lg text-[#b48a66] mb-1">{dict.checkout.uploadTitle}</p>
                  <p className="text-sm text-[#8a7f76]">{dict.checkout.uploadDesc}</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-[#f5f1eb] text-[#8a7f76] py-4 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors">
                {dict.checkout.changeMethod}
              </button>
              <button
                onClick={handleUploadAndSubmit}
                disabled={loading || !file}
                className="w-2/3 bg-[#b48a66] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9d7756] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : dict.checkout.confirmSend}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8 animate-in zoom-in-95 duration-500">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{dict.checkout.successTitle}</h1>
            <p className="text-lg text-[#6b625a] mb-8">
              {formData.paymentMethod === 'CREDIT_CARD' ? dict.checkout.successCard : dict.checkout.successManual}
            </p>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="bg-[#2c2825] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a1715] transition-colors"
            >
              {dict.checkout.backHome}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
