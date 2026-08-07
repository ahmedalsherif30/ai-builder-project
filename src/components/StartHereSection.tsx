import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Heart, ArrowLeft, MessageSquare, BookOpen, Clock, HelpCircle, Star, Award, Zap } from 'lucide-react';
import { CustomerJourney6Steps } from './CustomerJourney6Steps';

interface StartHereSectionProps {
  onNavigateToAi: () => void;
  onNavigateToServices: () => void;
  onNavigateToBook: () => void;
  onNavigateToAuth?: () => void;
  onNavigateToJournal?: () => void;
  onNavigateToDashboard?: () => void;
}

export const StartHereSection: React.FC<StartHereSectionProps> = ({
  onNavigateToAi,
  onNavigateToServices,
  onNavigateToBook,
  onNavigateToAuth,
  onNavigateToJournal,
  onNavigateToDashboard,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* 6 Steps Customer Journey Diagram */}
      <CustomerJourney6Steps
        onNavigateToAi={onNavigateToAi}
        onNavigateToAuth={onNavigateToAuth}
        onNavigateToJournal={onNavigateToJournal}
        onNavigateToServices={onNavigateToServices}
        onNavigateToDashboard={onNavigateToDashboard}
      />

      {/* 3 Step Onboarding Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="bg-slate-900/90 border border-emerald-900/80 hover:border-amber-500/50 p-6 rounded-2xl space-y-4 relative overflow-hidden group transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold font-mono flex items-center justify-center text-lg">
            1
          </div>
          
          <h3 className="text-lg font-bold text-slate-100 font-serif">
            كيف تكتب حلمك بدقة؟
          </h3>

          <ul className="text-xs text-slate-300 font-serif space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>اذكر تفاصيل الحلم بدقة دون زيادة أو نقصان.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>حدد حالتك الاجتماعية (عزباء، متزوجة، رجل، أعزب) وتاريخ الرؤية.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>اذكر مشاعرك أثناء الحلم (خوف، فرح، طمأنينة).</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onNavigateToAi}
              className="w-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>جرب التفسير المباشر الآن</span>
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 p-6 rounded-2xl space-y-4 relative overflow-hidden group transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold font-mono flex items-center justify-center text-lg">
            2
          </div>

          <h3 className="text-lg font-bold text-slate-100 font-serif">
            الفرق بين الخدمة المجانية والمدفوعة
          </h3>

          <div className="space-y-3 text-xs font-serif">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-900">
              <p className="font-bold text-emerald-300">الذكاء الاصطناعي (مجاني):</p>
              <p className="text-slate-300 text-[11px] mt-0.5">تحليل فوري مستند لقواعد كتاب 2026 لـ أحمد الشريف.</p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/40">
              <p className="font-bold text-amber-300">الخدمة المدفوعة (أحمد الشريف شخصياً):</p>
              <p className="text-slate-300 text-[11px] mt-0.5">تعبير كتابي أو صوتي أو جلسة مباشرة من أحمد الشريف مع متابعة.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToServices}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>استعرض الاستشارات الخاصة</span>
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/90 border border-emerald-900/80 hover:border-amber-500/50 p-6 rounded-2xl space-y-4 relative overflow-hidden group transition">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold font-mono flex items-center justify-center text-lg">
            3
          </div>

          <h3 className="text-lg font-bold text-slate-100 font-serif">
            لماذا تختار منصة أحمد الشريف؟
          </h3>

          <ul className="text-xs text-slate-300 font-serif space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>منهج شرعي رصين بعيد عن الخرافات والادعاءات.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>سرية كاملة وتشفير لكافة الرؤى والبيانات الشخصية.</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>ملف رؤى شخصي يحفظ تاريخ أحلامك وتأويلاتها.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onNavigateToBook}
              className="w-full bg-slate-950 border border-amber-500/40 text-amber-300 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-950"
            >
              <BookOpen className="w-4 h-4" />
              <span>اكتشف كتاب طبعة 2026</span>
            </button>
          </div>
        </div>

      </div>

      {/* Social Proof & Trust Stats */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-6">
        <h3 className="text-xl font-bold text-slate-100 font-serif">
          أرقام وثقة نفخر بها في خدمة زوارنا ومستفيدينا الكرام
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">150,000+</div>
            <div className="text-xs text-slate-300 font-serif mt-1">حلم ورؤيا تم تفسيرها</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">98.5%</div>
            <div className="text-xs text-slate-300 font-serif mt-1">نسبة رضا الرعاة والمستفيدين</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">27+</div>
            <div className="text-xs text-slate-300 font-serif mt-1">فصلاً في كتاب 2026</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">60</div>
            <div className="text-xs text-slate-300 font-serif mt-1">مقالاً علمياً موثقاً</div>
          </div>
        </div>
      </div>

    </div>
  );
};

