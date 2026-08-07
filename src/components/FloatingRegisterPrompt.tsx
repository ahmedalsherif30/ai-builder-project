import React, { useState, useEffect } from 'react';
import { UserPlus, X, Sparkles, ShieldCheck, Gift } from 'lucide-react';

interface FloatingRegisterPromptProps {
  onRegister: () => void;
  isLoggedIn?: boolean;
}

export const FloatingRegisterPrompt: React.FC<FloatingRegisterPromptProps> = ({
  onRegister,
  isLoggedIn = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user is logged in or already dismissed in session, do not show
    const isDismissed = sessionStorage.getItem('dismissed_floating_signup_2026');
    if (!isDismissed && !isLoggedIn) {
      // Small delay to draw subtle attention on first entry
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('dismissed_floating_signup_2026', 'true');
  };

  const handleRegisterClick = () => {
    handleDismiss();
    onRegister();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-16 right-3 sm:bottom-20 sm:right-6 z-50 max-w-sm w-[calc(100vw-1.5rem)] sm:w-96 bg-slate-950/95 border-2 border-amber-500/60 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-500 text-right font-serif"
      dir="rtl"
      role="dialog"
      aria-label="دعوة للتسجيل في المنصة"
    >
      {/* Top Bar with Badge and Close X Button */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-500/20 mb-3">
        <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>دعوة انضمام للمنصة</span>
        </div>
        
        {/* Close Button X */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition cursor-pointer"
          title="إغلاق والمتابعة كزائر عادي (X)"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
          <UserPlus className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-amber-300 mb-1 leading-snug">
            هل ترغب في التسجيل بالمنصة؟ 🌟
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            سجّل حسابك المجاني الآن لتوثيق رؤاك في ملفك الروحي الشخصي واستلام <span className="text-amber-300 font-bold">3 تفسيرات مجانية</span> عند التسجيل!
          </p>
        </div>
      </div>

      {/* Features bullet highlight */}
      <div className="bg-slate-900/90 rounded-xl p-2.5 mb-3 border border-slate-800 text-[11px] text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Gift className="w-3.5 h-3.5 shrink-0" />
          <span>رصيد ترحيبي مجاني لتفسير أحلامك</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>ملف روحي مشفر لحفظ وتوثيق كافة رؤاك</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleRegisterClick}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:scale-[1.02] cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>تسجيل حساب جديد مجاناً 🚀</span>
        </button>

        <button
          onClick={handleDismiss}
          className="w-full text-center text-[11px] text-slate-400 hover:text-amber-300 underline underline-offset-2 py-1 transition cursor-pointer"
        >
          المتابعة كزائر عادي دون تسجيل
        </button>
      </div>
    </div>
  );
};
