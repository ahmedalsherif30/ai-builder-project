import React from 'react';
import { Award, ShieldCheck, Heart, BookOpen, Sparkles, CheckCircle2, MessageSquare, PhoneCall, Wallet, Smartphone } from 'lucide-react';
import { Logo } from './Logo';

export const AboutUsSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        <div className="flex justify-center">
          <Logo size="xl" showText={false} />
        </div>

        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-1 rounded-full text-xs font-serif">
          <Award className="w-4 h-4 text-amber-400" />
          <span>النسب الشريف - من عائلة فاروقية الأشراف</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
          <span className="bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-300 bg-clip-text text-transparent">
            نبذة عن الشيخ أحمد الشريف
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-serif max-w-3xl mx-auto leading-relaxed">
          مؤلف كتاب <b>"تأويلات روحية لفهم المشاهدات المنامية"</b> طبعة 2026. باحث متخصص في علم تعبير الرؤى والمشاهدات المنامية والتوجيه النفسي والروحي.
        </p>
      </div>

      {/* Lineage & Background Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-slate-900/90 border border-emerald-900/80 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-800/60 pb-3">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              النسب والنشأة الروحية
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
            ولد بالقاهرة وترجع أصوله الكريمة إلى محافظة قنا مركز قفط. ينتمي إلى عائلة فاروقية الأشراف الشريفة الممتدة إلى سيدنا الحسن بن علي بن أبي طالب عليهما السلام.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
            نشأ في بيئة علمية رصينة ومحافظة حرصت على حفظ كتاب الله وتدبر معانيه ودراسة أمهات كتب التعبير والتفسير للعلماء الأوائل كابن سيرين والنابلسي وابن شاهين مع تهذيبها بروح العصر.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/80 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-800/60 pb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              المنهج والضوابط الشرعية
            </h3>
          </div>

          <ul className="text-xs sm:text-sm text-slate-300 font-serif space-y-3 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>الاعتماد الأول على الآيات القرآنية والأحاديث النبوية الصحيحة.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>مراعاة السياق الشخصي والنفسي والزماني والمكاني للرائي.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>التحذير الحازم من الخرافات والشعوذة والدجل والكهانة.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>الجمع بين حكمة السلف والتقنيات الحديثة والذكاء الاصطناعي المنضبط.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Book 2026 Spotlight */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-amber-500/40 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <span className="text-xs bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-full font-serif">
            الكتاب المعتمد 2026
          </span>
          <h3 className="text-2xl font-bold text-slate-100 font-serif">
            "تأويلات روحية لفهم المشاهدات المنامية"
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-serif max-w-xl">
            يتضمن 27 فصلاً شاملاً يغطي أكثر من 1000 رمز منامي، مع كبسولة برمجة الذكاء الاصطناعي الخاصة للشيخ أحمد الشريف.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href="https://wa.me/201558955525"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs hover:from-amber-400 hover:to-emerald-400 transition text-center flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>طلب الكتاب أو الاستشارة عبر الواتساب</span>
          </a>
        </div>
      </div>

      {/* Contact & Wallet Details */}
      <div className="bg-slate-900/90 border border-emerald-800 p-6 rounded-2xl space-y-4 text-center">
        <h3 className="text-lg font-bold text-slate-100 font-serif">
          معلومات التواصل والدفع الفوري الرسمي
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-serif pt-2">
          <div className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center">
            <Smartphone className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="font-bold text-slate-200 mb-2">التواصل عبر الواتساب المباشر:</p>
            <a
              href="https://wa.me/201558955525"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <span>زر التحويل والتواصل المباشر</span>
            </a>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 flex flex-col items-center justify-center">
            <Wallet className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-slate-200 mb-2">المحفظة الإلكترونية / إنستا باي:</p>
            <a
              href="https://wa.me/201558955525"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <span>زر التحويل المباشر للحساب</span>
            </a>
            <p className="text-[10px] text-slate-400 mt-1.5">فودافون - اتصالات - أورنج - InstaPay</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900">
            <BookOpen className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="font-bold text-slate-200">البريد الإلكتروني المباشر:</p>
            <p className="text-amber-300 font-mono text-xs mt-1 select-all">info@explaininddreams.com</p>
          </div>
        </div>
      </div>

    </div>
  );
};
