import React, { useState } from 'react';
import { ShieldCheck, FileText, RefreshCw, X, Lock } from 'lucide-react';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'refund';
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-950/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              السياسات القانونية والتنظيمية للمنصة
            </h3>
            <p className="text-xs text-emerald-400 font-serif">
              تأويلات روحية لفهم المشاهدات المنامية - طبعة 2026 أحمد الشريف
            </p>
          </div>
        </div>

        {/* Policy Tabs */}
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-emerald-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>سياسة الخصوصية والسرية</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-emerald-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الشروط والأحكام</span>
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'refund'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-emerald-700'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>سياسة الاسترجاع والضمان</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 text-xs font-serif text-slate-300 leading-relaxed pr-2 pl-1">
          
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-300">1. التزام السرية التامة للأحلام والرؤى</h4>
              <p>
                نحن في منصة <b>"تفسير الأحلام - أحمد الشريف"</b> نعتبر سرية الرؤيا وحرمة أسرار الرائي خطاً أحمر. جميع البيانات والأحلام المدخلة تُشفر تماماً ولا يُطلع عليها إلا أحمد الشريف أو المحرك الآلي المعالج.
              </p>

              <h4 className="text-sm font-bold text-amber-300">2. حماية البيانات الشخصية</h4>
              <p>
                لا نشارك رقم هاتف المستخدم، أو بريده الإلكتروني، أو هويته مع أي طرف ثالث تحت أي ظرف من الظروف.
              </p>

              <h4 className="text-sm font-bold text-amber-300">3. تشفير الاتصال والتخزين</h4>
              <p>
                تُحفظ الرؤى في سجل مشفر بتقنيات AES-256 لضمان عدم تسريب أي مشاهدة منامية أو تفاصيل شخصية.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-300">1. الضوابط الشرعية والاسترشادية</h4>
              <p>
                التأويل والتعبير المنشور في هذه المنصة يعتمد على المنهج الشرعي الرصين الموثق في كتاب <b>"تأويلات روحية لفهم المشاهدات المنامية" (طبعة 2026)</b>. والتأويل هو من باب الظن والاستئناس والتبشير، ولا يُبنى عليه أحكام قطعية أو قرارات مصيرية متهورة.
              </p>

              <h4 className="text-sm font-bold text-amber-300">2. آداب إرسال الرؤى</h4>
              <p>
                يُشترط التزام الرائي بالصدق في ذكر تفاصيل الحلم ودون تحريف أو كذب. يُمنع استخدام المنصة لإرسال أي محتوى خادش أو غير لائق.
              </p>

              <h4 className="text-sm font-bold text-amber-300">3. العضويات والاستشارات الخاصة</h4>
              <p>
                تضمن العضوية VIP والاستشارات المدفوعة أولوية الرد والسرعة والتفسير الشخصي الصوتي أو الكتابي المباشر.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-amber-300">1. ضمان التعبير والرضا</h4>
              <p>
                إذا لم يتم التعبير والرد على استشارتك المدفوعة خلال المدة المحددة للخدمة (24 ساعة للتفسير السريع أو 6 ساعات لخدمة الفVIP)، يحق لك استرداد المبلغ كاملاً فوراً.
              </p>

              <h4 className="text-sm font-bold text-amber-300">2. آليات الاسترداد</h4>
              <p>
                تتم عمليات الاسترداد عبر نفس طريقة الدفع المستخدمة (المحفظة الإلكترونية، إنستا باي InstaPay، أو بطاقة الدفع) عن طريق التواصل المباشر عبر <a href="https://wa.me/201558955525" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-md transition shadow-sm cursor-pointer">زر التواصل المباشر</a>.
              </p>

              <h4 className="text-sm font-bold text-amber-300">3. إلغاء العضويات الدورية</h4>
              <p>
                يمكنك إلغاء التجديد التلقائي لعضوية VIP في أي وقت بضغطة زر من ملفك الشخصي دون أي رسوم إضافية.
              </p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-emerald-900/60 flex justify-between items-center shrink-0 text-[11px] text-slate-400 font-mono">
          <span>آخر تحديث: 2026</span>
          <button
            onClick={onClose}
            className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-4 py-1.5 rounded-lg font-bold font-sans cursor-pointer"
          >
            موافق وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
