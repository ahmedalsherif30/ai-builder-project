import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  BookOpen,
  Heart,
  MessageSquare,
  Crown,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  HelpCircle,
  Zap,
  Play
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: "مرحباً بك في منصة ExplainingDream.com",
      subtitle: "دليلك الشامل لافتتاح تجربة إيمانية وروحية فريدة",
      description: "نرحب بك في المرجع الأول لتأويل المشاهدات المنامية بمنهجية أحمد الشريف (طبعة 2026 المحدثة). تجمع المنصة بين الضوابط الشرعية المعتمدة والذكاء الاصطناعي المتقدم.",
      icon: Compass,
      targetTab: "home",
      badge: "الخطوة 1 من 7",
      features: [
        "الاعتماد على ضوابط الكتاب والسنة وتأويلات 2026",
        "حماية كاملة وخصوصية سرية تامة لجميع بياناتك",
        "تواصل مباشر واستشارات فورية على مدار الساعة"
      ]
    },
    {
      title: "ابدأ من هنا - دليل المبتدئين",
      subtitle: "كيف تخوض تجربة التفسير الصحيحة بخطوات بسيطة؟",
      description: "قسم 'ابدأ من هنا' يوضح لك الفرق بين الرؤيا الصالحة من الله، وحلم الشيطان، وأضغاث الأحلام والنفس، وكيف تجعل رؤياك أدق للتفسير.",
      icon: Zap,
      targetTab: "start-here",
      badge: "الخطوة 2 من 7",
      features: [
        "معرفة شروط وكيفية كتابة الحلم بدقة",
        "التفرقة بين أنواع المنامات بأسلوب علمي شرعي",
        "نصائح مهمة قبل طلب التأويل"
      ]
    },
    {
      title: "مفسر الأحلام الذكي المباشر",
      subtitle: "تأويل فوري في ثوانٍ معدودة بطبقة منهجية أحمد الشريف",
      description: "أدخل حلمك، حالتك الاجتماعية، وشعورك أثناء الرؤيا، وسيقوم محرك الذكاء الاصطناعي بتحليل الرموز وتقديم تأويل مفصل ومقسم إلى رموز، بشائر، وتحذيرات.",
      icon: Sparkles,
      targetTab: "ai-interpreter",
      badge: "الخطوة 3 من 7",
      features: [
        "تأويل مجاني وسريع جداً",
        "مراعاة الحالة الاجتماعية وتفاصيل الرائي",
        "إمكانية حفظ النتيجة مباشرة في ملفك"
      ]
    },
    {
      title: "موسوعة وقاموس الرموز المنامية",
      subtitle: "أكثر من 10,000 رمز مفسر ومصنف",
      description: "ابحث في الموسوعة عن أي رمز (كالذهب، الثعبان، المطر، الزواج، الطيران، الموتى) واكتشف ما قاله ابن سيرين والنابلسي وأحمد الشريف في كل رمز.",
      icon: BookOpen,
      targetTab: "dictionary",
      badge: "الخطوة 4 من 7",
      features: [
        "بحث سريع ودقيق بالكلمات المفتاحية",
        "تفسيرات مقسمة حسب العزباء، المتزوجة، والمطلق",
        "مرجع شامل ومحدث دائماً"
      ]
    },
    {
      title: "ملف الرؤى والتسجيلات الشخصية",
      subtitle: "سجلك الخاص المحفوظ بأمان تام",
      description: "مكانك السري الخاص لتسجيل رؤياك وتأويلاتها المحفوظة، لمتابعة مدى تحقق الرؤى مع مرور الأيام وتدوين الملاحظات الشخصية.",
      icon: Heart,
      targetTab: "journal",
      badge: "الخطوة 5 من 7",
      features: [
        "حفظ مشفر وآمن ولن يطلع عليه أحد سواك",
        "متابعة تواريخ تحقق البشائر والمنامات",
        "إمكانية تصدير وطباعة السجل"
      ]
    },
    {
      title: "الخدمات والاستشارات المباشرة",
      subtitle: "تواصل مباشر مع أحمد الشريف شخصياً",
      description: "يمكنك طلب تفسير كتابي معتمد، تسجيل صوتي للحلم، أو حجز جلسة استشارية وتأويلية مباشرة عبر الواتساب الفوري.",
      icon: MessageSquare,
      targetTab: "services",
      badge: "الخطوة 6 من 7",
      features: [
        "رد كتابي مفصل وسريع خلال 24 ساعة",
        "تأويل صوتي بصوت أحمد الشريف",
        "جلسة مباشرة 30 دقيقة للإجابة عن الاستفسارات"
      ]
    },
    {
      title: "كتاب 2026 وعضوية VIP المميزة",
      subtitle: "اقتن المرجع الرسمي واحصل على مزايا غير محدودة",
      description: "اطلب نسختك من كتاب 'تأويلات روحية 2026' مطبوعاً أو PDF، أو انضم لعضوية VIP للاستفادة من استشارات صوتية وتأويلات بلا حدود طوال العام.",
      icon: Crown,
      targetTab: "vip",
      badge: "الخطوة 7 من 7",
      features: [
        "عضوية VIP تضمن أولوية الرد المباشر",
        "كوبون خصم 20% (ALSHERIF2026) لجميع الخدمات",
        "الوصول لكافة فصول الإصدار الذهبي"
      ]
    }
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      onNavigateTab(tourSteps[nextIndex].targetTab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      onNavigateTab(tourSteps[prevIndex].targetTab);
    }
  };

  const handleGoToSection = () => {
    onNavigateTab(step.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 font-sans dir-rtl animate-fade-in">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-400">
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold font-mono">
                {step.badge}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-serif mt-1">
                {step.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="إغلاق الجولة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle & Main Content */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-amber-300 font-serif">
            {step.subtitle}
          </p>

          <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-emerald-900/60">
            {step.description}
          </p>

          {/* Key Feature Highlights */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-emerald-400 block">
              أبرز المميزات في هذا القسم:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {step.features.map((feat, idx) => (
                <div key={idx} className="bg-slate-900 border border-emerald-900 p-2.5 rounded-xl flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Indicator dots */}
        <div className="flex items-center justify-center gap-2 py-1">
          {tourSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                onNavigateTab(s.targetTab);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentStep ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-900/60 pt-4">
          <button
            onClick={handleGoToSection}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>انتقل مباشرة إلى هذا القسم الآن</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                currentStep === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-950/40 flex items-center gap-1 transition cursor-pointer"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'إنهاء الجولة والاستمتاع بالمنصة' : 'الخطوة التالية'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
