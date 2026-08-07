import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Globe,
  Heart,
  BookOpen,
  ArrowLeft,
  Lock,
  Zap,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Star,
  FileText
} from 'lucide-react';

interface SectionProps {
  onNavigateToAi?: () => void;
  onNavigateToDictionary?: () => void;
  onNavigateToJournal?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToArticles?: () => void;
  onOpenAuth?: () => void;
}

// 1. Trusted By Section (إحصائيات وثقة المنصة)
export const TrustedBySection: React.FC = React.memo(() => {
  const stats = [
    { icon: Sparkles, value: '+50,000', label: 'حلم ورؤيا مفسرة', desc: 'بدقة وموثوقية عالية' },
    { icon: Award, value: '2026', label: 'طبعة المرجع المعتمد', desc: 'كتاب تأويلات روحية' },
    { icon: Globe, value: '+18 دولة', label: 'مستفيدون حول العالم', desc: 'ثقة العملاء في الوطن العربي والخارج' },
    { icon: ShieldCheck, value: '100%', label: 'تشفير وخصوصية', desc: 'ملف روحي شخصي لكل عميل' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 border-y border-amber-500/10 bg-slate-950/60 backdrop-blur-sm rounded-3xl my-6 dir-rtl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-900/50 hover:border-amber-500/40 transition duration-300">
              <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">{item.value}</div>
              <div className="text-xs sm:text-sm font-bold text-slate-100 font-serif mt-1">{item.label}</div>
              <div className="text-[11px] text-slate-400 font-serif mt-0.5">{item.desc}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

// 2. Features Section (مميزات المنصة الشاملة)
export const FeaturesSection: React.FC<SectionProps> = React.memo(({ onNavigateToAi, onNavigateToJournal }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'ذكاء اصطناعي روحي معتمد',
      desc: 'محرك مدرب خصيصاً على قواعد كتاب "تأويلات روحية" للشيخ أحمد الشريف لفك الرموز وتأويلها فورياً.',
    },
    {
      icon: Heart,
      title: 'ملف شخصي روحي مشفر',
      desc: 'سجل آمن يتيح لك توثيق رؤاك ومتابعة مدى تحقق دلالاتها في الواقع عبر الزمن.',
    },
    {
      icon: BookOpen,
      title: 'موسوعة الرموز والقرآنيات',
      desc: 'أكثر من 1000 رمز منامي مفكك مدعوم بالأدلة القرآنية والأحاديث الشريفة ولغة العرب.',
    },
    {
      icon: MessageSquare,
      title: 'استشارات خاصة وتفسير صوتي',
      desc: 'تواصل مباشر مع الباحث والشيخ أحمد الشريف للحصول على تفسير صوتي موثوق ومشفر.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6 dir-rtl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 font-serif">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>منظومة التعبير المتكاملة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
          لماذا منصة <span className="text-copper-gold">تأويل الأحلام</span> هي الاختيار الأول؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif max-w-2xl mx-auto">
          نجمع بين الأصالة الشرعية والتقنية الذكية الحديثة لتقديم تجربة تأويل فريدة وموثوقة.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/80 border border-emerald-900/60 hover:border-amber-400/60 p-5 rounded-2xl transition duration-300 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-serif">{item.title}</h3>
                <p className="text-xs text-slate-300 font-serif leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

// 3. AI Advantages Section (مزايا التفوق بالذكاء الاصطناعي الروحي)
export const AiAdvantagesSection: React.FC<SectionProps> = React.memo(({ onNavigateToAi }) => {
  const advantages = [
    'تفكيك فوري للرموز المنامية بربطها بالقرآن والسنة.',
    'مراعاة سياقك الشخصي: الحالة الاجتماعية، الجنس، ووقت المنام.',
    'تحديد الجانب النفسي والفرق بين الرؤيا وأضغاث الأحلام.',
    'توصية بالأذكار والآيات القرآنية المناسبة للتحصين.',
    'تنبيه شفاف إذا كانت الرؤيا معقدة تتطلب استشارة خاصة.',
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 dir-rtl">
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold font-serif">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>محرك الذكاء الاصطناعي الروحي 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif leading-tight">
            دقة علمية وتأصيل شرعي في ثوانٍ معدودة
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
            يعتمد نظامنا على معالجة ذكية دقيقة مدربة خصيصاً على كتاب "تأويلات روحية" للباحث أحمد الشريف، لتقديم قراءة شاملة تحترم ضوابط علم التعبير دون تكلف أو ترهيب.
          </p>

          <div className="space-y-2 pt-1">
            {advantages.map((adv, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-serif">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{adv}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToAi}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl transition cursor-pointer inline-flex items-center gap-2 font-serif"
            >
              <Sparkles className="w-4 h-4" />
              <span>جرب التفسير الفوري بالذكاء الاصطناعي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 text-center shrink-0 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-amber-300 font-serif">تنويه وأمان الخصوصية</h3>
          <p className="text-xs text-slate-300 font-serif leading-relaxed">
            جميع بياناتك وأحلامك مشفرة تماماً ومحفوظة حصرياً بملفك الشخصي دون إمكانية الاطلاع عليها من أي طرف ثالث.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-serif font-bold">
            🔒 تشفير تام 256-bit SSL
          </div>
        </div>
      </div>
    </section>
  );
});

// 4. FAQ Section (الأسئلة الشائعة)
export const FaqSection: React.FC = React.memo(() => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'هل التفسير بالذكاء الاصطناعي موثوق ومبني على أسس شرعية؟',
      a: 'نعم، المحرك الذكي مدرب خصيصاً ومستند كلياً إلى كتاب "تأويلات روحية لفهم المشاهدات المنامية" (طبعة 2026) للشيخ أحمد الشريف، حيث يقوم بتفكيك الرموز وربطها بالقرآن والسنة ولغة العرب مع مراعاة الحالة الشخصية للرائي.',
    },
    {
      q: 'كيف يتم حفظ أحلامي وتأويلاتها في الملف الروحي الشخصي؟',
      a: 'بمجرد تفسير حلمك أو كتابته، يمكنك حفظه بنقرة واحدة في "سجل الأحلام". يتم تخزين السجل بشكل مشفر وتام الخصوصية في حسابك الخاص لتتمكن من متابعة تحقق الدلالات عبر الوقت.',
    },
    {
      q: 'ما الفرق بين التفسير بالذكاء الاصطناعي والاستشارة الصوتية الخاصة؟',
      a: 'التفسير الذكي يمنحك قراءة فورية أولية شاملة للرموز في ثوانٍ. أما الاستشارة الصوتية فتكون تواصل مباشر مع الشيخ أحمد الشريف لدراسة الرؤى المعقدة والاستخارات المصيرية وتسجيل رد صوتي خاص يصلك عبر الواتساب.',
    },
    {
      q: 'هل بياناتي وأحلامي محمية من الخصوصية؟',
      a: 'بالتأكيد. تلتزم المنصة بأعلى معايير الأمن والتشفير، ولا يتم مشاركة أي حلم أو بيانات شخصية مع أي جهة خارجية أو عرضها للعامة.',
    },
    {
      q: 'كيف أستفيد من مكافآت الإحالة والرصيد المجاني؟',
      a: 'عند مشاركة رابط إحالتك الخاص مع أصدقائك وانضمامهم للمنصة، تحصل فورياً على أحلام مجانية إضافية تضاف لرصيدك بملفك الشخصي.',
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6 dir-rtl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 font-serif">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>الأسئلة الشائعة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-serif">
          إجابات شاملة لجميع تساؤلاتك
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif">
          كل ما تحتاج معرفته عن طريقة عمل المنصة، الخصوصية، والاستشارات.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-emerald-900/60 rounded-2xl overflow-hidden transition duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-100 font-serif hover:text-amber-300 cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 font-serif leading-relaxed border-t border-slate-800/80 bg-slate-950/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

// 5. Homepage CTA Section (دعوة للعمل والتفسير)
export const HomepageCtaSection: React.FC<SectionProps> = React.memo(({ onNavigateToAi, onNavigateToServices }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 dir-rtl">
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-slate-950 text-center space-y-5 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="inline-block bg-slate-950 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold font-serif shadow-md">
            ابدأ رحلة فهم رؤاك الآن ✨
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif leading-tight">
            جاهز لفك رموز منامك واكتشاف معانيه الروحية؟
          </h2>
          <p className="text-xs sm:text-sm font-serif font-medium leading-relaxed opacity-95 text-slate-900">
            اكتب حلمك الآن لتتلقى تفسيراً فورياً معتمداً بالذكاء الاصطناعي أو اطلب استشارة صوتية خاصة من الشيخ أحمد الشريف.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onNavigateToAi}
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-2xl transition cursor-pointer flex items-center justify-center gap-2 font-serif"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تفسير فوري بالذكاء الاصطناعي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToServices}
            className="w-full sm:w-auto bg-amber-100 hover:bg-white text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2 font-serif border border-amber-300"
          >
            <MessageSquare className="w-4 h-4 text-emerald-800" />
            <span>طلب استشارة خاصة مباشرة</span>
          </button>
        </div>
      </div>
    </section>
  );
});
