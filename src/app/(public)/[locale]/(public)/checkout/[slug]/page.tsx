'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';
import { countryCodes, countryNames, type CountryCode } from '@/lib/country-codes';

export default function CheckoutPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = use(params);
  const { locale, dict } = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Syria default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    paymentMethod: 'INSTAPAY',
  });

  const planMap: Record<string, { title: string; price: number }> = {
    basic: { title: dict.plans.plan1.name, price: 45 },
    premium: { title: dict.plans.plan2.name, price: 99 },
    ultimate: { title: dict.plans.plan3.name, price: 299 },
    consultation: { title: dict.consultation?.title ? `${dict.consultation.title} ${dict.consultation.titleHighlight}` : 'Consultation', price: 15 },
    book: { title: dict.book?.title ? `${dict.book.title} ${dict.book.titleHighlight} ${dict.book.titleEnd}` : 'Book', price: 10 },
    'snack-book': { title: dict.snackBook?.title ? `${dict.snackBook.title} ${dict.snackBook.titleHighlight} ${dict.snackBook.titleEnd}`.trim() : 'Breakfast Alternatives', price: 5 },
  };
  const planDetails = planMap[slug] || planMap.basic;

  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = digitsOnly.length >= selectedCountry.minLength && digitsOnly.length <= selectedCountry.maxLength;

  const fullPhone = `${selectedCountry.dial} ${phoneNumber}`;

  const validatePhone = (): boolean => {
    if (!digitsOnly) {
      setPhoneError(locale === 'ar' ? 'الرجاء إدخال رقم الهاتف' : 'Please enter a phone number');
      return false;
    }
    if (digitsOnly.length < selectedCountry.minLength) {
      const name = countryNames[selectedCountry.code]?.[locale === 'ar' ? 'ar' : 'en'] || selectedCountry.code;
      setPhoneError(
        locale === 'ar'
          ? `رقم الهاتف لـ${name} يجب أن يكون ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} أرقام`
          : `Phone number for ${name} must be ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} digits`
      );
      return false;
    }
    if (digitsOnly.length > selectedCountry.maxLength) {
      const name = countryNames[selectedCountry.code]?.[locale === 'ar' ? 'ar' : 'en'] || selectedCountry.code;
      setPhoneError(
        locale === 'ar'
          ? `رقم الهاتف لـ${name} يجب أن يكون ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} أرقام`
          : `Phone number for ${name} must be ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} digits`
      );
      return false;
    }
    setPhoneError('');
    return true;
  };

  const filteredCountries = countrySearch
    ? countryCodes.filter((c) => {
        const name = countryNames[c.code]?.[locale === 'ar' ? 'ar' : 'en'] || '';
        const q = countrySearch.toLowerCase();
        return (
          name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      })
    : countryCodes;

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.customerName || !formData.customerEmail) return;
      if (!validatePhone()) return;
      setStep(2);
    } else if (step === 2) {
      // Create pending order immediately when payment method is chosen
      setLoading(true);
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: fullPhone,
            paymentMethod: formData.paymentMethod,
            planSlug: slug,
            receiptUrl: null,
          }),
        });

        if (response.ok) {
          setStep(3);
        } else {
          alert(dict.checkout.orderError);
        }
      } catch (error) {
        console.error('Order creation error:', error);
        alert(dict.checkout.serverError);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmAndWhatsApp = () => {
    setStep(4);
    const methodLabels: Record<string, string> = { INSTAPAY: 'InstaPay', BANK_TRANSFER: 'Bank Transfer', PAYPAL: 'PayPal' };
    const methodLabel = methodLabels[formData.paymentMethod] || formData.paymentMethod;
    const msg = encodeURIComponent(
      `مرحباً، أنا ${formData.customerName}\n` +
      `تم تسجيل طلب اشتراك:\n` +
      `الباقة: ${planDetails.title}\n` +
      `المبلغ: $${planDetails.price}\n` +
      `طريقة الدفع: ${methodLabel}\n` +
      `أرجو إرفاق صورة إيصال الدفع هنا 👇`
    );
    window.open(`https://wa.me/201142632709?text=${msg}`, '_blank');
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
                <div className="flex gap-2" dir="ltr">
                  {/* Country code selector */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => { setShowCountryDropdown(!showCountryDropdown); setCountrySearch(''); }}
                      className="flex items-center gap-1.5 bg-[#faf8f5] border border-[#e8dfd1] rounded-xl px-3 py-3 hover:border-[#b48a66] transition-colors min-w-[120px] text-left"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="font-bold text-sm">{selectedCountry.dial}</span>
                      <ChevronDown size={14} className={`text-[#8a7f76] transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-72 max-h-64 bg-white border border-[#e8dfd1] rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="sticky top-0 bg-white p-2 border-b border-[#f0eadd]">
                          <input
                            type="text"
                            autoFocus
                            placeholder={locale === 'ar' ? 'ابحث عن بلد...' : 'Search country...'}
                            className="w-full bg-[#faf8f5] border border-[#e8dfd1] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#b48a66] focus:border-transparent"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                          />
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredCountries.map((country) => {
                            const name = countryNames[country.code]?.[locale === 'ar' ? 'ar' : 'en'] || country.code;
                            return (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                  setPhoneNumber('');
                                  setPhoneError('');
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#faf8f5] transition-colors text-left ${
                                  selectedCountry.code === country.code ? 'bg-[#b48a66]/5' : ''
                                }`}
                              >
                                <span className="text-lg">{country.flag}</span>
                                <span className="text-sm font-medium flex-1">{name}</span>
                                <span className="text-xs text-[#8a7f76] font-mono">{country.dial}</span>
                              </button>
                            );
                          })}
                          {filteredCountries.length === 0 && (
                            <div className="px-4 py-6 text-center text-sm text-[#8a7f76]">
                              {locale === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone number input */}
                  <input
                    required
                    type="tel"
                    placeholder={`${'0'.repeat(selectedCountry.minLength)}`}
                    className={`flex-1 bg-[#faf8f5] border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#b48a66] focus:border-transparent outline-none text-left font-mono ${
                      phoneError ? 'border-red-400' : 'border-[#e8dfd1]'
                    }`}
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d\s-]/g, '');
                      setPhoneNumber(val);
                      setPhoneError('');
                    }}
                    onBlur={validatePhone}
                  />
                </div>

                {/* Validation feedback */}
                <div className="flex items-center justify-between mt-1.5 min-h-[20px]">
                  {phoneError ? (
                    <p className="text-red-500 text-xs font-medium">{phoneError}</p>
                  ) : digitsOnly.length > 0 ? (
                    <p className={`text-xs font-medium ${isPhoneValid ? 'text-green-600' : 'text-[#8a7f76]'}`}>
                      {isPhoneValid
                        ? (locale === 'ar' ? '✓ رقم صحيح' : '✓ Valid number')
                        : (locale === 'ar'
                          ? `${digitsOnly.length} من ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} رقم`
                          : `${digitsOnly.length} of ${selectedCountry.minLength === selectedCountry.maxLength ? selectedCountry.minLength : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} digits`
                        )}
                    </p>
                  ) : <span />}
                </div>
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
              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'INSTAPAY' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="INSTAPAY" checked={formData.paymentMethod === 'INSTAPAY'} onChange={() => setFormData({...formData, paymentMethod: 'INSTAPAY'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#b48a66]" />
                    <span className="font-bold text-lg">InstaPay</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="BANK_TRANSFER" checked={formData.paymentMethod === 'BANK_TRANSFER'} onChange={() => setFormData({...formData, paymentMethod: 'BANK_TRANSFER'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-[#b48a66]" />
                    <span className="font-bold text-lg">{dict.checkout.bankTransfer}</span>
                  </div>
                </div>
              </label>

              <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'PAYPAL' ? 'border-[#b48a66] bg-[#b48a66]/5' : 'border-[#e8dfd1] hover:border-[#b48a66]/50'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" name="payment" value="PAYPAL" checked={formData.paymentMethod === 'PAYPAL'} onChange={() => setFormData({...formData, paymentMethod: 'PAYPAL'})} className="w-5 h-5 text-[#b48a66] focus:ring-[#b48a66]" />
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#b48a66]"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.644h6.568c2.602 0 4.282 1.317 4.636 3.54.018.113.03.224.038.334.06.715-.038 1.533-.306 2.43-.966 3.243-3.207 4.272-6.006 4.272H8.756a.77.77 0 0 0-.757.644l-1.023 6.54a.641.641 0 0 1-.633.54h-.267v-.05ZM19.166 8.3c-.006.064-.013.13-.022.194-.796 3.045-3.1 4.393-6.175 4.393h-1.563a.766.766 0 0 0-.757.644l-.8 5.073a.536.536 0 0 0 .529.622h3.716a.675.675 0 0 0 .666-.564l.028-.14.527-3.345.034-.184a.675.675 0 0 1 .666-.564h.42c2.716 0 4.843-1.103 5.466-4.293.26-1.333.125-2.446-.562-3.228a2.68 2.68 0 0 0-.768-.573l.095-.035Z"/></svg>
                    <span className="font-bold text-lg">PayPal</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#f5f1eb] text-[#8a7f76] py-4 rounded-xl font-bold hover:bg-[#e8dfd1] transition-colors">
                {dict.checkout.back}
              </button>
              <button type="submit" disabled={loading} className="w-2/3 bg-[#2c2825] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a1715] transition-colors flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : dict.checkout.continue}
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
              {formData.paymentMethod === 'INSTAPAY' && (
                <div className="text-center space-y-2" dir="ltr">
                  <p className="font-bold text-sm text-[#8a7f76]">{dict.checkout.instaPayLabel}</p>
                  <p className="text-2xl font-black text-[#2c2825] tracking-wider">01142632709</p>
                </div>
              )}
              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="space-y-3" dir="ltr">
                  <div className="text-center space-y-1">
                    <p className="font-bold text-xs text-[#8a7f76] uppercase tracking-wide">Account Name</p>
                    <p className="text-sm font-bold text-[#2c2825]">BATOOL ABDU ALJABAR ALAHMAD</p>
                  </div>
                  <div className="border-t border-[#e8dfd1] pt-3 text-center space-y-1">
                    <p className="font-bold text-xs text-[#8a7f76] uppercase tracking-wide">IBAN (EGP)</p>
                    <p className="text-sm font-bold text-[#2c2825] tracking-wider break-all">EG960003014850020382772000120</p>
                  </div>
                  <div className="border-t border-[#e8dfd1] pt-3 text-center space-y-1">
                    <p className="font-bold text-xs text-[#8a7f76] uppercase tracking-wide">SWIFT Code</p>
                    <p className="text-sm font-bold text-[#2c2825] tracking-wider">NBEGEGCX148</p>
                  </div>
                  <div className="border-t border-[#e8dfd1] pt-3 text-center space-y-1">
                    <p className="font-bold text-xs text-[#8a7f76] uppercase tracking-wide">Bank</p>
                    <p className="text-sm font-bold text-[#2c2825]">National Bank of Egypt</p>
                  </div>
                </div>
              )}
              {formData.paymentMethod === 'PAYPAL' && (
                <div className="text-center space-y-2" dir="ltr">
                  <p className="font-bold text-sm text-[#8a7f76]">{dict.checkout.paypalLabel}</p>
                  <a href="https://paypal.me/BatoolAlahmad" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-[#b48a66] hover:underline block">
                    paypal.me/BatoolAlahmad
                  </a>
                </div>
              )}
            </div>

            <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-2xl p-6 text-center">
              <p className="text-sm text-[#2c2825] font-bold leading-relaxed">
                {dict.checkout.whatsappInstruction}
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={handleConfirmAndWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1da851] transition-colors flex justify-center items-center gap-2"
              >
                {dict.checkout.confirmWhatsApp}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8 animate-in zoom-in-95 duration-500">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{dict.checkout.successTitle}</h1>
            <p className="text-lg text-[#6b625a] mb-8">
              {dict.checkout.successManual}
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
