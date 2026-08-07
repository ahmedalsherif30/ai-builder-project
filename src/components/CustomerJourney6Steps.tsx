import React from 'react';
import { Sparkles, PenTool, UserPlus, BookmarkCheck, UserCheck, HeartHandshake, ArrowLeft } from 'lucide-react';

interface CustomerJourney6StepsProps {
  onNavigateToAi?: () => void;
  onNavigateToAuth?: () => void;
  onNavigateToJournal?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToDashboard?: () => void;
  className?: string;
}

export const CustomerJourney6Steps: React.FC<CustomerJourney6StepsProps> = ({
  onNavigateToAi,
  onNavigateToAuth,
  onNavigateToJournal,
  onNavigateToServices,
  onNavigateToDashboard,
  className = '',
}) => {
  const steps = [
    {
      step: '01',
      title: 'كتابة الرؤيا',
      subtitle: 'اكتب حلمك بالتفصيل',
      icon: PenTool,
      badge: null,
      borderClass: 'border-amber-900/70 hover:border-amber-500/80',
      bgGradient: 'from-amber-950/30 via-slate-900/90 to-slate-950',
      onClick: onNavigateToAi,
    },
    {
      step: '02',
      title: 'تفسير بالذكاء الاصطناعي',
      subtitle: 'تأويل فوري مجاني 100%',
      icon: Sparkles,
      badge: 'فوري',
      borderClass: 'border-emerald-800/70 hover:border-emerald-400/80',
      bgGradient: 'from-emerald-950/30 via-slate-900/90 to-slate-950',
      onClick: onNavigateToAi,
    },
    {
      step: '03',
      title: 'إنشاء حساب عضوية',
      subtitle: 'حفظ بياناتك بأمان',
      icon: UserPlus,
      badge: null,
      borderClass: 'border-blue-900/70 hover:border-blue-500/80',
      bgGradient: 'from-blue-950/30 via-slate-900/90 to-slate-950',
      onClick: onNavigateToAuth,
    },
    {
      step: '04',
      title: 'حفظ الحلم بالملف',
      subtitle: 'تشفير وسجل خاص',
      icon: BookmarkCheck,
      badge: null,
      borderClass: 'border-teal-900/70 hover:border-teal-500/80',
      bgGradient: 'from-teal-950/30 via-slate-900/90 to-slate-950',
      onClick: onNavigateToJournal,
    },
    {
      step: '05',
      title: 'الملف الروحي الشخصي',
      subtitle: 'تحليلات ومتابعة التحقق',
      icon: UserCheck,
      badge: null,
      borderClass: 'border-purple-900/70 hover:border-purple-500/80',
      bgGradient: 'from-purple-950/30 via-slate-900/90 to-slate-950',
      onClick: onNavigateToDashboard || onNavigateToJournal,
    },
    {
      step: '06',
      title: 'استشارة خاصة',
      subtitle: 'حوار مباشر مع د. أحمد الشريف',
      icon: HeartHandshake,
      badge: 'خاص',
      borderClass: 'border-amber-800/70 hover:border-amber-400/80',
      bgGradient: 'from-amber-950/40 via-slate-900/90 to-slate-950',
      onClick: onNavigateToServices,
    },
  ];

  return (
    <section className={`max-w-6xl mx-auto px-4 py-4 space-y-4 ${className}`}>
      {/* Top Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>رحلة العميل المبسطة</span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-100 font-serif leading-tight">
          كيف تعمل المنصة؟ <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">6 خطوات سهلة ومباشرة</span>
        </h2>

        <p className="text-xs text-slate-300 font-serif max-w-xl mx-auto leading-relaxed">
          دليلك الواضح للتأويل الروحي المعتمد ابتداءً من كتابة حلمك إلى متابعة تحققه بملفك الشخصي.
        </p>
      </div>

      {/* 6 Steps Grid - Horizontal 3/6 Column Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-6xl mx-auto">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              onClick={item.onClick}
              className={`group relative bg-gradient-to-br ${item.bgGradient} border ${item.borderClass} p-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between`}
            >
              {/* Card Top Row: Badge & Step Number */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-6 h-6 rounded-md bg-slate-950/80 border border-slate-700/60 text-slate-200 font-mono font-extrabold text-[10px] flex items-center justify-center shrink-0">
                  {item.step}
                </div>

                <div>
                  {item.badge ? (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full tracking-tight">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Card Center: Icon & Titles */}
              <div className="my-1 space-y-1.5 text-center flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:bg-amber-500/20 transition-transform shrink-0">
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-100 font-serif leading-snug">
                  {item.title}
                </h3>

                <p className="text-[11px] text-slate-400 font-serif leading-tight line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              {/* Card Bottom: Action */}
              <div className="pt-2 mt-1 border-t border-slate-800/60 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <span>ابدأ</span>
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
