'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CreditCard, Wallet, CheckCircle, Loader2 } from 'lucide-react';

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
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

  // Hardcoded for demo purposes since we bypass real DB on client
  // In a real scenario, this would be fetched from the server or passed as props
  const planDetails = slug === 'premium' ? { id: '2', title: 'خطة التحول الكامل', price: 120 } : { id: '1', title: 'خطة البداية الأساسية', price: 50 };

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
        setStep(4); // Success step
      } else {
        alert("حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!file) {
      alert('الرجاء رفع صورة الإيصال أولاً');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload to Vercel Blob via API Route
      const uploadRes = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      
      const uploadData = await uploadRes.json();
      
      if (uploadData.url) {
        // 2. Process Order with receipt URL
        await processOrder(uploadData.url);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("فشل رفع الصورة. الرجاء المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2825] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#f0eadd]">
        
        {/* Progress Bar */}
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

        {/* Step 1: User Details */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">معلوماتك الشخصية</h1>
              <p className="text-[#8a7f76]">رح نتواصل معك على الواتساب، يرجى التأكد من الرقم</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
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
                <label className="block text-sm font-bold mb-2">رقم الواتساب (مع رمز البلد)</label>
                <input 
                  required
                  type="tel" 
                  placeholder="+961 70 123 456"
                  className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none text-left"
                  dir="ltr"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#2c2825] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a1715] transition-colors mt-8">
              متابعة للدفع
            </button>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">طريقة الدفع</h1>
              <p className="text-[#8a7f76]">المبلغ المطلوب: {planDetails.price}$</p>
            </div>

            <div className="space-y-4">
              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'CREDIT_CARD' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="CREDIT_CARD" 
                    checked={formData.paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setFormData({...formData, paymentMethod: 'CREDIT_CARD'})}
                    className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#b48a66]" />
                    <span className="font-bold text-lg">بطاقة ائتمان / بنكية</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'INSTAPAY' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="INSTAPAY" 
                    checked={formData.paymentMethod === 'INSTAPAY'}
                    onChange={() => setFormData({...formData, paymentMethod: 'INSTAPAY'})}
                    className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]"
                  />
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#b48a66]" />
                    <span className="font-bold text-lg">تحويل بنكي / InstaPay</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'SHAMCASH' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="SHAMCASH" 
                    checked={formData.paymentMethod === 'SHAMCASH'}
                    onChange={() => setFormData({...formData, paymentMethod: 'SHAMCASH'})}
                    className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]"
                  />
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#b48a66]" />
                    <span className="font-bold text-lg">شام كاش (سوريا)</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#f5f1eb] text-[#8a7f76] py-4 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors">
                رجوع
              </button>
              <button type="submit" disabled={loading} className="w-2/3 bg-[#2c2825] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a1715] transition-colors flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : formData.paymentMethod === 'CREDIT_CARD' ? 'ادفع الآن' : 'متابعة'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Manual Upload */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">إرفاق إيصال الدفع</h1>
              <p className="text-[#8a7f76]">الرجاء تحويل مبلغ {planDetails.price}$ ثم إرفاق صورة الإيصال</p>
            </div>

            <div className="bg-[#f5f1eb] p-6 rounded-xl border border-[#e8dfd1] mb-6">
              {formData.paymentMethod === 'INSTAPAY' ? (
                <div className="text-center space-y-2">
                  <p className="font-bold text-sm text-[#8a7f76]">رقم InstaPay / الحساب البنكي</p>
                  <p className="text-xl font-bold" dir="ltr">+20 100 123 4567</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <p className="font-bold text-sm text-[#8a7f76]">رقم شام كاش</p>
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
                  <p className="font-bold text-lg text-[#b48a66] mb-1">اضغط هنا لرفع صورة الإيصال</p>
                  <p className="text-sm text-[#8a7f76]">أو اسحب الصورة وأفلتها هنا</p>
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
                تغيير الطريقة
              </button>
              <button 
                onClick={handleUploadAndSubmit} 
                disabled={loading || !file} 
                className="w-2/3 bg-[#b48a66] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9d7756] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'تأكيد وإرسال'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-8 animate-in zoom-in-95 duration-500">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">تم استلام طلبك بنجاح!</h1>
            <p className="text-lg text-[#6b625a] mb-8">
              {formData.paymentMethod === 'CREDIT_CARD' 
                ? 'تم تأكيد الدفع بنجاح. رح نتواصل معك على الواتساب قريباً جداً لنبدأ الرحلة.' 
                : 'تم استلام الإيصال. رح يتم مراجعته والتواصل معك على الواتساب قريباً.'}
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-[#2c2825] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a1715] transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
