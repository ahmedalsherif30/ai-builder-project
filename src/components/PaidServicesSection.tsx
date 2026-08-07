import React, { useState } from 'react';
import { MessageSquare, Mic, Video, CheckCircle2, ShieldCheck, Sparkles, Tag, ArrowLeft, Clock, Calendar, AlertCircle } from 'lucide-react';
import { MOCK_PAID_SERVICES, MOCK_COUPONS } from '../data/mockData';
import { ServicePackage, MaritalStatus } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface PaidServicesSectionProps {
  initialDreamText?: string;
  onOrderSuccess?: (order: any) => void;
}

export const PaidServicesSection: React.FC<PaidServicesSectionProps> = ({ initialDreamText = '', onOrderSuccess }) => {
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [dreamText, setDreamText] = useState(initialDreamText);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [scheduledDate, setScheduledDate] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyWalletNumber = async () => {
    await safeCopyToClipboard('00201558955525');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const handleOpenCheckout = (service: ServicePackage) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setCompletedOrder(null);
    setAppliedDiscount(0);
    setCouponInput('');
    setCouponMsg(null);
    if (initialDreamText) {
      setDreamText(initialDreamText);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (found) {
      setAppliedDiscount(found.discountPercentage);
      setCouponMsg({ text: `تم تطبيق الخصم بنجاح (${found.discountPercentage}%)!`, isError: false });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ text: 'كود الخصم غير صحيح أو منتهي الصلاحية.', isError: true });
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedService) return 0;
    if (appliedDiscount > 0) {
      return Math.round(selectedService.price * (1 - appliedDiscount / 100));
    }
    return selectedService.price;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/paid-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          clientName,
          clientEmail,
          clientPhone,
          dreamText,
          maritalStatus,
          amountPaid: calculateFinalPrice(),
          couponCode: appliedDiscount > 0 ? couponInput : null,
          deliveryType: selectedService.type,
          scheduledSessionDate: scheduledDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشلت عملية تقديم الطلب.');
      }

      setCompletedOrder(data.order);
      if (onOrderSuccess) onOrderSuccess(data.order);

      // Trigger direct WhatsApp notification to Sheikh Ahmed / Admin
      const whatsappText = `أهلاً شيخ أحمد الشريف، طلب استشارة خاصة جديد 🚨\n- نوع الخدمة: ${selectedService.title}\n- اسم العميل: ${clientName}\n- رقم الهاتف: ${clientPhone || 'غير محدد'}\n- البريد: ${clientEmail}\n- الحالة الاجتماعية: ${maritalStatus}\n- التفاصيل/المنام: ${dreamText}\n- المبلغ: $${calculateFinalPrice()}`;
      window.open(`https://wa.me/201558955525?text=${encodeURIComponent(whatsappText)}`, '_blank');
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إتمام الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>خدمات التعبير المباشر والخاص – أحمد الشريف</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
          طلب تفسير خاص وحجز الاستشارات المباشرة
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif">
          اختر الخدمة المناسبة لرؤياك للحصول على تعبير مكتوب أو صوتي أو حوار مباشر مع أحمد الشريف.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_PAID_SERVICES.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 space-y-6 shadow-xl relative flex flex-col justify-between transition ${
              pkg.popular
                ? 'border-amber-500/80 shadow-2xl shadow-amber-950/40 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 ring-1 ring-amber-500/40'
                : 'border-emerald-900/60 hover:border-emerald-700/80'
            }`}
          >
            {pkg.badge && (
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] px-3 py-0.5 rounded-full shadow-md font-serif">
                {pkg.badge}
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  {pkg.type === 'written' && <MessageSquare className="w-5 h-5" />}
                  {pkg.type === 'audio' && <Mic className="w-5 h-5" />}
                  {pkg.type === 'session' && <Video className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-serif leading-tight">
                    {pkg.title}
                  </h3>
                  <span className="text-xs text-emerald-400 font-serif flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {pkg.deliveryTime}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-200 font-serif leading-relaxed">
                {pkg.subtitle}
              </p>

              {/* Price Display */}
              <div className="flex items-baseline gap-2 pt-2.5 border-t border-emerald-900/40">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif">
                  ${pkg.price}
                </span>
                {pkg.originalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ${pkg.originalPrice}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-300 font-serif">/ للطلب</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-serif">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleOpenCheckout(pkg)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                pkg.popular
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                  : 'bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-amber-300'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>طلب الخدمة الآن</span>
            </button>

          </div>
        ))}
      </div>

      {/* Coupon Promotion Banner & WhatsApp Direct Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-xs font-serif">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-100 block text-sm">كوبون إطلاق طبعة 2026:</strong>
              <span className="text-slate-300">
                استخدم الكود <code className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono">ALSHERIF2026</code> لخصم 20%.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-xs font-serif">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-100 block text-sm">التواصل المباشر عبر الواتساب:</strong>
              <span className="text-slate-300">
                تحدث فورياً مع السكرتارية أو أحمد الشريف.
              </span>
            </div>
          </div>
          <a
            href="https://wa.me/201558955525"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 transition cursor-pointer text-xs sm:text-sm shadow-md"
          >
            <span>زر التحويل والتواصل المباشر</span>
          </a>
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            {completedOrder ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-serif">
                  تم استلام طلبك بنجاح!
                </h3>
                <p className="text-xs text-slate-300 font-serif max-w-md mx-auto leading-relaxed">
                  رقم الطلب الخاص بك: <b className="text-amber-300 font-mono">{completedOrder.id}</b>
                  <br />
                  سيتم تجهيز التفسير عبر البريد <b className="text-emerald-300">{completedOrder.clientEmail}</b> وإرساله لملفك الشخصي خلال الوقت المحدد.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-400 cursor-pointer"
                >
                  العودة للرئيسية
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4 text-sm sm:text-base">
                
                <div className="border-b border-amber-500/40 pb-3">
                  <span className="text-xs text-amber-400 font-serif font-semibold block">
                    ★ نموذج طلب خدمة التفسير الخاصة بالمريدين
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif">
                    {selectedService.title} (${calculateFinalPrice()} USD)
                  </h3>
                </div>

                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      الاسم الكريم: <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكامل..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      البريد الإلكتروني: <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      رقم الهاتف / الواتساب:
                    </label>
                    <input
                      type="tel"
                      placeholder="+966 50 000 0000"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      الحالة الاجتماعية:
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400"
                    >
                      <option value="single">عزباء / أعزب</option>
                      <option value="married">متزوج / متزوجة</option>
                      <option value="pregnant">حامل</option>
                      <option value="divorced">مطلق / مطلقة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      تاريخ الميلاد <span className="text-emerald-400 text-xs font-normal">(اختياري)</span>:
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {selectedService.type === 'session' && (
                  <div>
                    <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                      تاريخ ووقت الجلسة المفضلة:
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-amber-200 font-bold mb-1.5 text-sm sm:text-base">
                    تفاصيل المنام أو الرؤيا المكتوبة: <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="اكتب تفاصيل المنام بدقة لاستكمال التفسير..."
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                    className="w-full bg-black border border-emerald-800/80 rounded-xl p-3 text-amber-100 text-sm sm:text-base focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Coupon Input */}
                <div className="bg-black p-3.5 rounded-xl border border-emerald-900/80 space-y-2">
                  <label className="block text-amber-200 font-bold text-sm">كود الخصم (إن وجد):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل الكود (مثال: ALSHERIF2026)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-emerald-800 rounded-xl p-2.5 text-amber-200 uppercase font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-emerald-950 border border-emerald-700 text-amber-300 px-4 py-2 rounded-xl hover:bg-emerald-900 font-bold cursor-pointer text-sm"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-xs ${couponMsg.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Total Price summary & Interactive Payment Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-4 bg-emerald-950/90 rounded-2xl border border-amber-500/40 text-sm sm:text-base font-serif">
                    <span className="text-amber-100 font-bold">المبلغ الإجمالي المستحق:</span>
                    <span className="text-2xl font-extrabold text-amber-300">
                      ${calculateFinalPrice()} USD
                    </span>
                  </div>

                  {/* Interactive E-Wallet / InstaPay Actions instead of static phone text */}
                  <div className="bg-black p-4 rounded-2xl border border-amber-500/40 space-y-3">
                    <div className="font-bold text-amber-300 text-sm sm:text-base flex items-center justify-between">
                      <span>💳 خيارات الدفع بالمحفظة الإلكترونية أو إنستا باي:</span>
                      <span className="text-xs bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800 font-normal">تحويل فوري مباشر</span>
                    </div>

                    <p className="text-xs sm:text-sm text-amber-100/90 font-serif leading-relaxed">
                      يدعم الدفع الفوري عبر (فودافون كاش / اتصالات كاش / أورنج كاش / InstaPay). اضغط على الأزرار التالية للدفع المباشر والتأكيد:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyWalletNumber}
                        className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer transition"
                      >
                        <Tag className="w-4 h-4 text-amber-400" />
                        <span>{copiedNumber ? '✓ تم تجهيز بيانات الحساب والتحويل' : 'زر تحويل المحفظة / إنستا باي'}</span>
                      </button>

                      <a
                        href={`https://wa.me/201558955525?text=${encodeURIComponent(`السلام عليكم، أرغب في تأكيد الدفع لطلب خدمة: ${selectedService.title} بمبلغ $${calculateFinalPrice()}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>تأكيد الدفع فوراً عبر الواتساب</span>
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold py-4 rounded-xl text-base sm:text-lg shadow-xl shadow-amber-950/50 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'إتمام وإرسال طلب التفسير والدفع'}</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
