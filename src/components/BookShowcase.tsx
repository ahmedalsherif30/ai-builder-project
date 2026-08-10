import React, { useState } from 'react';
import { BookOpen, ShoppingBag, Star, Award, Sparkles, X, Smartphone, Wallet, Lock, Compass, Heart, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface BookShowcaseProps {
  onNavigateToServices?: () => void;
  onNavigateToIslamic?: (subTab?: 'quran' | 'prayers' | 'adhkar') => void;
}

export const BookShowcase: React.FC<BookShowcaseProps> = ({ onNavigateToServices, onNavigateToIslamic }) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Order Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [format, setFormat] = useState<'pdf' | 'printed'>('pdf');
  const [paymentMethod, setPaymentMethod] = useState<'ewallet' | 'card'>('ewallet');

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsOrderModalOpen(false);
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Hero Showcase Section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Book Cover Mockup Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group">
              
              {/* Gold glowing border shadow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-300" />
              
              <div className="relative bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-6 w-64 sm:w-72 shadow-2xl space-y-4 text-center">
                
                <div className="border border-amber-500/30 p-4 rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/80 space-y-3 flex flex-col items-center">
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded font-mono uppercase">
                    طبعة 2026 المعتمدة
                  </span>

                  {/* Logo on cover */}
                  <div className="my-2">
                    <Logo size="lg" showText={false} />
                  </div>

                  <div className="py-2">
                    <h3 className="text-xl font-bold text-amber-200 font-serif leading-tight">
                      تأويلات روحية
                    </h3>
                    <p className="text-xs text-emerald-300 font-serif mt-1">
                      لفهم المشاهدات المنامية
                    </p>
                  </div>

                  <div className="border-t border-amber-500/20 pt-3 w-full">
                    <span className="text-xs font-bold text-slate-100 font-serif block">
                      تأليف: أحمد الشريف
                    </span>
                    <span className="text-[10px] text-emerald-400 font-serif">
                      المنصة الرسمية للتفسير
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 font-serif px-1">
                  <span>الصفحات: 340 صفحة</span>
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9/5
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Book Description & Details */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-serif">
              <Award className="w-4 h-4 text-amber-400" />
              <span>المستند المرجعي الأحدث في علم التأويل الروحي 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
              كتاب "تأويلات روحية لفهم المشاهدات المنامية"
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
              مرجع شامل لـ <b>أحمد الشريف</b> يضع قواعد دقيقة وضوابط رصينة لتفكيك رموز الأحلام والمشاهدات المنامية استناداً إلى القرآن الكريم والسنة النبوية ولغة العرب والأبعاد النفسية والروحية.
            </p>

            {/* Pricing Options Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-amber-500/40 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-serif">النسخة الرقمية (PDF)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-300 font-serif">$15</span>
                  <span className="text-xs text-slate-400 font-serif">دولار أمريكي (USD)</span>
                </div>
                <p className="text-[11px] text-slate-300">تحميل مباشر مع تحديثات طبعة 2026 مدى الحياة.</p>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/40 p-3.5 rounded-2xl space-y-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-serif">النسخة المطبوعة (جلد فاخر)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-300 font-serif">$35</span>
                  <span className="text-xs text-slate-400 font-serif">دولار أمريكي (USD)</span>
                </div>
                <p className="text-[11px] text-slate-300">توصيل مجاني لأي مكان ودعم مباشر.</p>
              </div>
            </div>

            {/* E-wallet payment banner */}
            <div className="bg-emerald-950/90 border border-emerald-700/60 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400 shrink-0" />
                <span><b>الدفع بالمحفظة الإلكترونية / إنستا باي:</b> فودافون كاش - اتصالات كاش - أورنج كاش</span>
              </div>
              <a
                href="https://wa.me/201558955525"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span>زر التحويل والتواصل المباشر</span>
              </a>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-950/40 transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>طلب واستلام الكتاب الآن</span>
              </button>

              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-emerald-700/60 text-emerald-200 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>شروط وسرية استلام الكتاب</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Privacy Terms Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute top-4 left-4 p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs text-amber-400 font-serif flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>إشعار سرية المحتوى وطبعة 2026 المعتمدة</span>
              </span>
              <h3 className="text-lg font-bold text-slate-100 font-serif mt-0.5">
                كتاب "تأويلات روحية لفهم المشاهدات المنامية" - أحمد الشريف
              </h3>
            </div>

            <div className="bg-slate-950 border border-amber-500/40 p-5 rounded-xl space-y-3 font-serif text-slate-200 text-xs sm:text-sm leading-relaxed shadow-sm">
              <p className="font-bold text-amber-300">
                🔒 تنبيه هام بشأن محتويات ومخطوطة الكتاب:
              </p>
              <p className="text-slate-300 leading-relaxed">
                محتويات وقواعد هذا الكتاب تُعد مرجعاً مصوناً وسرياً وخاصاً بـ أحمد الشريف. لا يتم عرض أو إرسال فصول الكتاب إلا بعد قيام العميل بطلب النسخة ورفع إيصال الدفع عبر المحفظة أو الفيزا، ليتم مراجعته وتأكيده شخصياً من قِبَل الإدارة، ومن ثم إرسال النسخة المعتمدة والمشفرة مباشرة.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                إغلاق
              </button>

              <button
                onClick={() => {
                  setIsPrivacyModalOpen(false);
                  setIsOrderModalOpen(true);
                }}
                className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>شراء واستلام الكتاب كاملاً</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Book Order Modal with E-Wallet Payment */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3">
              <Logo size="sm" showText={false} />
              <div>
                <h3 className="text-base font-bold text-slate-100 font-serif">
                  طلب كتاب "تأويلات روحية 2026"
                </h3>
                <p className="text-xs text-amber-400">تأليف أحمد الشريف</p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="bg-emerald-950 border border-emerald-700 p-5 rounded-xl text-center space-y-3 text-emerald-200 text-xs font-serif">
                <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="font-bold text-sm text-slate-100">تم تسجيل طلبك بنجاح!</p>
                <p>تم إرسال تفاصيل استلام النسخة وتأكيد الدفع عبر المحفظة الإلكترونية إلى بريدك {email} والواتساب.</p>
                <a
                  href={`https://wa.me/201558955525?text=${encodeURIComponent(`أهلاً شيخ أحمد الشريف، قمت بطلب نسخة ${format === 'pdf' ? 'PDF' : 'مطبوعة'} من كتاب تأويلات روحية 2026 باسم ${name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>متابعة الشحن عبر الواتساب المباشر</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    required
                    placeholder="أدخل اسمك..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">البريد الإلكتروني لاستلام الكتاب:</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-900 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">نوع النسخة والتسعير:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormat('pdf')}
                      className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition ${
                        format === 'pdf'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-emerald-900'
                      }`}
                    >
                      <div>نسخة PDF</div>
                      <div className="text-[10px] font-mono">$15 USD</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('printed')}
                      className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition ${
                        format === 'printed'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-emerald-900'
                      }`}
                    >
                      <div>نسخة مطبوعة</div>
                      <div className="text-[10px] font-mono">$35 USD</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">طريقة الدفع الفوري:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ewallet')}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'ewallet'
                          ? 'bg-emerald-900 text-amber-300 border-amber-400'
                          : 'bg-slate-950 text-slate-300 border-emerald-900'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-amber-400" />
                      <span>محفظة / إنستا باي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-emerald-900 text-amber-300 border-amber-400'
                          : 'bg-slate-950 text-slate-300 border-emerald-900'
                      }`}
                    >
                      <span>فيز / ماستركارد</span>
                    </button>
                  </div>

                  {paymentMethod === 'ewallet' && (
                    <div className="mt-2 p-3 bg-zinc-950 border border-amber-500/30 rounded-xl text-xs text-emerald-200 space-y-2">
                      <p className="font-bold text-amber-300">طريقة التحويل عبر المحفظة الإلكترونية وإنستا باي:</p>
                      <a
                        href="https://wa.me/201558955525?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D9%80%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AD%D9%88%D9%8A%D9%84%20%D9%88%D8%B7%D9%84%D8%A8%20%D9%83%D8%AA%D8%A7%D8%A8%20%D8%AA%D8%A3%D9%88%D9%8A%D9%84%D8%A7%D8%AA%20%D8%B1%D9%88%D8%AD%D9%8A%D8%A9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-lg border border-emerald-400 text-center flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                      >
                        <Smartphone className="w-4 h-4 text-amber-300" />
                        <span>اضغط هنا للتحويل والتواصل المباشر</span>
                      </a>
                      <p className="text-[10px] text-slate-400 text-center">يدعم (فودافون كاش، اتصالات كاش، أورنج كاش، InstaPay)</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-xs hover:from-amber-400 hover:to-emerald-400 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>تأكيد الطلب واستلام الكتاب</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export const IslamicToolsStrip: React.FC<{ onNavigateToIslamic?: (subTab?: 'quran' | 'prayers' | 'adhkar') => void }> = ({ onNavigateToIslamic }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="text-center space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-amber-300 font-serif flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>الخدمات والأدوات الإيمانية المباركة</span>
        </h4>
        <p className="text-xs text-slate-300 font-serif">
          تصفح الأركان الإسلامية المتاحة عبر المنصة مجاناً واستمتع بالتلاوات والأدوات الإيمانية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Quran & Tafsir */}
        <div
          onClick={() => onNavigateToIslamic?.('quran')}
          className="bg-gradient-to-br from-slate-900 to-emerald-950/80 border border-emerald-800/80 hover:border-amber-400/80 rounded-2xl p-5 space-y-3 transition cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h5 className="text-sm font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
              1. القرآن وتفسيره وسماعه
            </h5>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              تلاوات خاشعة لجميع السور بأصوات كبار القراء، مع التفسير الميسر والاستماع المباشر.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs text-amber-400 font-serif font-bold group-hover:underline">
            <span>تصفح المصحف المفسر ←</span>
          </div>
        </div>

        {/* 2. Qibla & Prayers */}
        <div
          onClick={() => onNavigateToIslamic?.('prayers')}
          className="bg-gradient-to-br from-slate-900 to-emerald-950/80 border border-emerald-800/80 hover:border-amber-400/80 rounded-2xl p-5 space-y-3 transition cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
              <Compass className="w-5 h-5" />
            </div>
            <h5 className="text-sm font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
              2. اتجاه القبلة ومواقيت الصلاة
            </h5>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              بوصلة دقيقة لتحديد اتجاه القبلة أينما كنت، مع مواقيت الصلاة اليومية لمدينتك.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs text-amber-400 font-serif font-bold group-hover:underline">
            <span>تحديد القبلة والمواقيت ←</span>
          </div>
        </div>

        {/* 3. Electronic Misbaha & Adhkar */}
        <div
          onClick={() => onNavigateToIslamic?.('adhkar')}
          className="bg-gradient-to-br from-slate-900 to-emerald-950/80 border border-emerald-800/80 hover:border-amber-400/80 rounded-2xl p-5 space-y-3 transition cursor-pointer group shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
              <Heart className="w-5 h-5" />
            </div>
            <h5 className="text-sm font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
              3. السبحة الإلكترونية والأذكار
            </h5>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              عداد أذكار ذكي، أذكار الصباح والمساء والنوم، وأسماء الله الحسنى لتعطير لسانك بالذكر.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs text-amber-400 font-serif font-bold group-hover:underline">
            <span>فتح السبحة والأذكار ←</span>
          </div>
        </div>
      </div>
    </div>
  );
};
