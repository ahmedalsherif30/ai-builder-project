import React from 'react';
import { Crown, CheckCircle2, Sparkles, Star, ShieldCheck, Heart, Award, ArrowLeft } from 'lucide-react';

interface VipMembershipSectionProps {
  onUpgradeSuccess: () => void;
}

export const VipMembershipSection: React.FC<VipMembershipSectionProps> = ({ onUpgradeSuccess }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>عضوية VIP الخاصة للسالكين والمهتمين بالأحلام</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
          عضوية VIP والاشتراك الذهبي في منصة أحمد الشريف
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif">
          احصل على أولوية استثنائية لتعبير أحلامك، مقالات ومقاطع فيديو حصرية، وخصومات دائمة على كافة الاستشارات المباشرة.
        </p>
      </div>

      {/* Pricing Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <div className="bg-slate-900/80 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 font-serif block">
              العضوية العامة
            </span>
            <h3 className="text-2xl font-bold text-slate-100 font-serif">
              المجانية
            </h3>
            <div className="text-3xl font-extrabold text-emerald-400 font-serif">
              $0 <span className="text-xs text-slate-400 font-normal">/ مدى الحياة</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 font-serif pt-4 border-t border-emerald-900/40">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تفسير فوري غير محدود بالذكاء الاصطناعي</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الوصول لموسوعة الأحلام حسب الحروف</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>حفظ حتى 5 أحلام بملف الرؤى الشخصي</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تصفح أدوات القرآن ومكتبة الأذكار</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 rounded-xl font-bold text-xs bg-slate-950 text-slate-400 border border-slate-800 cursor-default">
            الخطة الحالية مفعلة
          </button>
        </div>

        {/* VIP Gold Plan */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-950/40 relative flex flex-col justify-between ring-1 ring-amber-500/50">
          <span className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs px-4 py-1 rounded-full shadow-lg font-serif">
            ✨ الباقة الذهبية الشاملة 2026
          </span>

          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 font-serif block">
              عضوية VIP الروحية الذهبية
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
              الاشتراك الذهبي الشامل
            </h3>
            <div className="flex items-baseline gap-2 text-3xl sm:text-4xl font-extrabold text-amber-300 font-serif">
              $29 <span className="text-xs sm:text-sm text-slate-300 font-normal">/ شهرياً</span>
              <span className="text-xs text-amber-400/90 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md font-sans">
                (أو $249 / سنوياً - شهرين مجاناً)
              </span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-serif pt-4 border-t border-amber-500/30">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>تفسير لا محدود للأحلام بالذكاء الاصطناعي مع نموذج الشريف المتقدم</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>أولوية استجابة ومراجعة بشرية فورية من الشيخ أحمد الشريف</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>خصم دائم 30% على كافة الاستشارات الصوتية والجلسات المباشرة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>تحميل النسخة الكاملة المعتمدة لكتاب تأويلات روحية 2026 (PDF)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span>خط تواصل وتحصين مباشر وVIP عبر الواتساب للرد السريع</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              const msg = `أهلاً شيخ أحمد الشريف، يرغب عميل جديد في الاشتراك في العضوية الذهبية VIP ($29 شهرياً / $249 سنوياً) وتفعيل المميزات الخاصة.`;
              window.open(`https://wa.me/201558955525?text=${encodeURIComponent(msg)}`, '_blank');
              onUpgradeSuccess();
            }}
            className="w-full py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-slate-950 hover:from-amber-400 hover:to-emerald-400 transition cursor-pointer shadow-2xl shadow-amber-500/20 active:scale-[0.99]"
          >
            اشترك الآن في الباقة الذهبية ($29/شهرياً)
          </button>
        </div>

      </div>

    </div>
  );
};
