import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Award,
  Search,
  Compass,
  User,
  Mic,
  BookMarked,
  MessageSquare,
  ChevronLeft,
  Layers,
  Star,
  Zap,
  Lock,
  Gift,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeroSectionProps {
  onStartInterpretation: (dreamText: string) => void;
  setActiveTab: (tab: string) => void;
  onSearch?: (query: string) => void;
  onOpenTour?: () => void;
  user?: UserProfile;
  journalCount?: number;
  onOpenClientDashboard?: () => void;
  onOpenAuth?: () => void;
  onOpenShareRewards?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  onStartInterpretation,
  setActiveTab,
  onSearch,
  onOpenTour,
  user,
  journalCount = 0,
  onOpenClientDashboard,
  onOpenAuth,
  onOpenShareRewards,
}) => {
  const [activeHeroMode, setActiveHeroMode] = useState<'ai' | 'dictionary' | 'consultation' | 'book'>('ai');
  const [quickInput, setQuickInput] = useState('');
  const [symbolSearchQuery, setSymbolSearchQuery] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onStartInterpretation(quickInput);
    }
  };

  const handleSymbolSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbolSearchQuery.trim()) {
      if (onSearch) {
        onSearch(symbolSearchQuery.trim());
      } else {
        setActiveTab('dictionary');
      }
    }
  };

  const popularSymbols = [
    'الذهب',
    'الثعبان',
    'السيارة',
    'سورة يس',
    'الماء',
    'الزواج',
    'العسل',
    'الخاتم',
    'السفر',
    'الطفل الرضيع'
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 border-b border-amber-500/10 dir-rtl">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Member Greeting or Simple Badge */}
        {user && user.isLoggedIn && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs text-amber-300 font-serif bg-slate-950/90 border border-amber-500/40 px-3.5 py-1 rounded-full shadow">
              مرحباً بك، {user.name} ✨
            </span>
          </div>
        )}

        {/* Main Headline & Subtitle */}
        <div className="text-center max-w-5xl mx-auto space-y-3.5 pt-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-emerald-950 to-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold font-serif shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>هل كل ما تراه بمنامك له معنى وأثر</span>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-100 font-serif leading-tight tracking-tight whitespace-nowrap">
            منصة <span className="text-copper-gold">تفسير الأحلام والتأويل</span> بملف شخصي <span className="text-emerald-400">روحي</span>
          </h1>
          <p className="text-sm sm:text-base text-amber-200/90 font-serif leading-relaxed max-w-3xl mx-auto">
            <b>أول وأكبر منصة عربية للتأويل الروحي.</b>
            <br />
            سجّل رؤيتك، احتفظ بها، وافهم دلالاتها وأسباب تحققها في الواقع في <b>ملف شخصي روحي مشفّر خاص بك</b>.
            <br />
            بإشراف ومراجعة الباحث والكاتب <b>أحمد الشريف</b>.
          </p>
        </div>

        {/* Dynamic Multi-Mode Interactive Hero Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-950/95 border border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative space-y-5">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 pb-3 border-b border-emerald-900/60 w-full">
              <button
                onClick={() => setActiveHeroMode('ai')}
                className={`w-full justify-center px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs lg:text-xs xl:text-sm font-bold font-serif transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-sm ${
                  activeHeroMode === 'ai'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700 hover:text-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>تفسير فوري بالذكاء الاصطناعي</span>
              </button>

              <button
                onClick={() => setActiveHeroMode('dictionary')}
                className={`w-full justify-center px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs lg:text-xs xl:text-sm font-bold font-serif transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-sm ${
                  activeHeroMode === 'dictionary'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700 hover:text-amber-300'
                }`}
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>موسوعة الرموز</span>
              </button>

              <button
                onClick={() => setActiveHeroMode('consultation')}
                className={`w-full justify-center px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs lg:text-xs xl:text-sm font-bold font-serif transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-sm ${
                  activeHeroMode === 'consultation'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700 hover:text-amber-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>استشارة صوتية من د. أحمد</span>
              </button>

              <button
                onClick={() => setActiveHeroMode('book')}
                className={`w-full justify-center px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs lg:text-xs xl:text-sm font-bold font-serif transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-sm ${
                  activeHeroMode === 'book'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg'
                    : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700 hover:text-amber-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>كتاب تأويلات روحية</span>
              </button>
            </div>

            {/* Content per mode */}
            {activeHeroMode === 'ai' && (
              <form onSubmit={handleQuickSubmit} className="space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-amber-300 font-semibold gap-2">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                    اكتب رؤياك بالتفصيل لتفسيرها فورياً بالذكاء الاصطناعي:
                  </span>
                  <span className="text-emerald-400 font-serif text-xs">
                    استجابة فورية 100% مجانية
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="مثال: رأيت أنني أسير في أرض خضراء ورأيت أساور من ذهب يلمع نورها ثم استمعت لآية من سورة يس..."
                  className="w-full bg-slate-900/90 border border-emerald-800/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>خصوصية تامة ومشفرة بملفك الشخصي المحفوظ</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-500 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition cursor-pointer"
                  >
                    <Sparkles className="w-4.5 h-4.5" />
                    <span>فسّر حلمك الآن فوريًا</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {activeHeroMode === 'dictionary' && (
              <form onSubmit={handleSymbolSearchSubmit} className="space-y-4 animate-fade-in">
                <div className="text-xs sm:text-sm text-amber-300 font-semibold flex items-center gap-2">
                  <Search className="w-4.5 h-4.5 text-amber-400" />
                  <span>ابحث عن أي رمز منامي في موسوعة الأحلام الشاملة (+1000 رمز):</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="ادخل اسم الرمز (مثال: ذهب، ثعبان، سيارة، طيران، أسنان، كعك)..."
                    value={symbolSearchQuery}
                    onChange={(e) => setSymbolSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/90 border border-emerald-800 rounded-2xl py-3.5 pr-11 pl-32 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                  <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="submit"
                    className="absolute left-2 top-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    استعراض التفسير
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-serif">الأكثر بحثاً:</span>
                  {popularSymbols.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => {
                        if (onSearch) onSearch(sym);
                        else setActiveTab('dictionary');
                      }}
                      className="bg-slate-900 border border-emerald-900 hover:border-amber-400 text-slate-300 hover:text-amber-300 text-[11px] px-3 py-1 rounded-xl transition cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </form>
            )}

            {activeHeroMode === 'consultation' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-start gap-4 bg-slate-900 border border-amber-500/30 p-4 sm:p-5 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-300 font-serif">
                      استشارة خاصة وتسجيل صوتي من الشيخ والباحث أحمد الشريف
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif">
                      احصل على تفسير صوتي موثوق ومشفر لرؤياك يصلك مباشرة عبر الواتساب مع دراسة سياقك الروحي والشرعي بكل دقة وحفظ التفسير بملفك الشخصي.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('services')}
                    className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer transition shadow-xl inline-flex items-center gap-2"
                  >
                    <span>طلب استشارة خاصة من الشيخ الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeHeroMode === 'book' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-start gap-4 bg-slate-900 border border-emerald-800 p-4 sm:p-5 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-300 font-serif">
                      كتاب "تأويلات روحية لفهم المشاهدات المنامية" – طبعة 2026
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-serif">
                      المصدر الأصلي الذي تُبنى عليه قاعدة بيانات المنصة ومحرك الذكاء الاصطناعي. يتضمن 24 فصلاً شاملاً في قواعد التعبير وربط الرموز بالواقع.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-amber-500/40 font-bold px-8 py-3 rounded-2xl text-xs sm:text-sm cursor-pointer transition shadow-xl inline-flex items-center gap-2"
                  >
                    <span>استعراض فصول المرجع والكتاب</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
});

