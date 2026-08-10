import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Printer,
  Share2,
  Sparkles,
  BookOpen,
  FileText,
  Check,
  ShieldCheck,
  Zap,
  Star,
  ExternalLink,
  MessageSquare,
  Award
} from 'lucide-react';

export interface NewsletterDigestData {
  title?: string;
  subtitle?: string;
  author?: string;
  lastUpdated?: string;
  welcomeMessage?: string;
  breakingNews?: string;
  featuredArticles?: {
    id: string;
    title: string;
    chapter: string;
    excerpt: string;
    url?: string;
  }[];
  spiritualWisdom?: {
    verse: string;
    surah: string;
    explanation: string;
    actionableAdvice: string;
  };
  platformStats?: {
    totalDreamsInterpreted: string;
    verifiedSatisfaction: string;
    activeMembers: string;
    publishedArticles: string;
  };
  subscriberBonus?: {
    code: string;
    title: string;
    description: string;
  };
}

interface SpiritualNewsletterDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriberCode?: string;
  subscriberContact?: string;
  digestData?: NewsletterDigestData;
  onNavigateTab?: (tab: string) => void;
}

export const SpiritualNewsletterDigestModal: React.FC<SpiritualNewsletterDigestModalProps> = ({
  isOpen,
  onClose,
  subscriberCode = 'NEWS-2026-X800',
  subscriberContact = '',
  digestData,
  onNavigateTab
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Fallback defaults if digestData is loading or partial
  const digest = {
    title: digestData?.title || "الملف الإخباري الروحي المتجدد والمستجدات الشاملة",
    subtitle: digestData?.subtitle || "النشرة البريدية الرسمية لمنصة ExplainingDream.com - طبعة 2026",
    author: digestData?.author || "الشيخ والباحث د. أحمد الشريف",
    welcomeMessage: digestData?.welcomeMessage || "أهلاً ومرحباً بك في النشرة الروحية البريدية المعتمدة. يسعدنا انضمامك لمجتمع منصة ExplainingDream.com لتلقي أحدث الأبحاث وتنبيهات الدروس المباشرة والبشائر المنامية.",
    breakingNews: digestData?.breakingNews || "تحديث منصة تعبير الأحلام: تم رفع دراسات متخصصة وموسوعة الرموز القرآنية المباشرة، مع تفعيل خدمة التفسير الذكي والخدمات الصوتية المباشرة.",
    featuredArticles: digestData?.featuredArticles || [
      {
        id: "art-quran-rules",
        title: "منهجية الاستدلال بالقرآن الكريم في تفسير الأحلام والرموز المنامية",
        chapter: "دراسات إيمانية مرجعية",
        excerpt: "دراسة شاملة توضح الضوابط الشرعية للربط بين الآيات القرآنية وحالة الرائي النفسية والاجتماعية دون تخمين أو تكلف."
      },
      {
        id: "art-fulfilled-dreams",
        title: "كيف تتعرف على الرؤيا الصادقة والبشرى المحققة بالواقع؟",
        chapter: "قواعد التعبير والتأويل",
        excerpt: "علامات ودلائل واضحة بين الحلم النفسي ورؤيا البشرى الإلهية وكيفية متابعتها بوعي واطمئنان."
      }
    ],
    spiritualWisdom: digestData?.spiritualWisdom || {
      verse: "﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ﴾",
      surah: "سورة النور - آية 35",
      explanation: "نفحة النور الإلهي في المنام تعكس انشراح الصدر وزوال الظلمات وتجلي الحقائق للرائي.",
      actionableAdvice: "حافظ على أذكار النوم وطهارة البدن بنية فتح البصيرة والسكينة الروحية."
    },
    platformStats: digestData?.platformStats || {
      totalDreamsInterpreted: "14,850+",
      verifiedSatisfaction: "99.4%",
      activeMembers: "35,200+",
      publishedArticles: "420+"
    },
    subscriberBonus: digestData?.subscriberBonus || {
      code: "NEWS-BONUS-2026",
      title: "هدية الاشتراك الترحيبية - خصم 20% وأولوية التفسير الصوتي",
      description: "استخدم الكود عند طلب أي خدمة مدفوعة أو تفسير صوتي للحصول على أولوية الاستجابة المباشرة من الشيخ أحمد الشريف."
    }
  };

  // Compile standard formatted text report for copying/downloading
  const fullTextReport = `✨ [الملف الإخباري الروحي المعتمد - ExplainingDream.com] ✨
المصدر: ${digest.title} (${digest.subtitle})
إشراف: ${digest.author}
رقم عضوية الاشتراك: ${subscriberCode}
الجهة/البريد: ${subscriberContact || 'عضو مشترك بالنشرة الروحية'}
تاريخ الاستلام: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}

---------------------------------------------------
📰 أحدث مستجدات وأخبار المنصة:
${digest.breakingNews}

📚 أحدث الأبحاث العلمية المقتطفة:
${digest.featuredArticles.map((art, i) => `${i + 1}. ${art.title} (${art.chapter})\n   - ${art.excerpt}`).join('\n')}

🔮 نفحة ونور اليوم الروحي:
${digest.spiritualWisdom.verse} - [${digest.spiritualWisdom.surah}]
الشرح: ${digest.spiritualWisdom.explanation}
الربط والتوجيه: ${digest.spiritualWisdom.actionableAdvice}

📊 إحصائيات المنصة الموثقة:
- التفسيرات المقدمة: ${digest.platformStats.totalDreamsInterpreted}
- نسبة الرضا والتحقق: ${digest.platformStats.verifiedSatisfaction}
- الأعضاء النشطون: ${digest.platformStats.activeMembers}

🎁 كود هديتك الترحيبية بالاشتراك:
الكود: ${digest.subscriberBonus.code}
الوصف: ${digest.subscriberBonus.title}

---------------------------------------------------
رابط زيارة المنصة وتفسير رؤيتك الآن: https://explainingdream.com
`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(fullTextReport);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(digest.subscriberBonus.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>الملف الإخباري الروحي - ${subscriberCode}</title>
            <style>
              body { font-family: 'Amiri', 'Traditional Arabic', Georgia, serif; padding: 40px; color: #0f172a; line-height: 1.8; }
              h1 { color: #065f46; border-bottom: 2px solid #d97706; pb: 10px; }
              .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
              .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 12px; margin-bottom: 15px; }
              .quran { background: #ecfdf5; border-right: 4px solid #059669; padding: 15px; font-size: 18px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #64748b; border-t: 1px solid #e2e8f0; pt: 15px; }
            </style>
          </head>
          <body>
            <h1>${digest.title}</h1>
            <p><strong>${digest.subtitle}</strong></p>
            <p><span class="badge">كود الاشتراك: ${subscriberCode}</span> | إشراف: ${digest.author}</p>
            <hr />
            <div class="box">
              <h3>أحدث مستجدات وأخبار المنصة:</h3>
              <p>${digest.breakingNews}</p>
            </div>
            <div class="box">
              <h3>أبرز الأبحاث المقررة من كتاب تأويلات روحية:</h3>
              ${digest.featuredArticles.map(art => `<h4>${art.title}</h4><p><em>${art.chapter}</em>: ${art.excerpt}</p>`).join('')}
            </div>
            <div class="quran">
              <strong>${digest.spiritualWisdom.verse}</strong>
              <p>${digest.spiritualWisdom.explanation}</p>
            </div>
            <div class="box">
              <h3>كود هديتك المباشرة:</h3>
              <p><strong>${digest.subscriberBonus.code}</strong> - ${digest.subscriberBonus.title}</p>
            </div>
            <div class="footer">
              تم استخراج هذا الملف المعتمد من منصة ExplainingDream.com © 2026 للشيخ د. أحمد الشريف
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = `أهلاً بك! تم استلام "الملف الإخباري الروحي المعتمد" لمنصة ExplainingDream.com برقم اشتراك (${subscriberCode}).\nشاهد أحدث أبحاث ومستجدات كتاب تأويلات روحية 2026 مع هديتك الترحيبية:\nhttps://explainingdream.com`;
    window.open(`https://wa.me/201558955525?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-serif overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-3xl w-full p-5 sm:p-8 text-slate-100 shadow-2xl space-y-6 relative my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-amber-300 p-2 rounded-2xl bg-slate-900/80 border border-slate-700 transition cursor-pointer shadow-md"
          title="إغلاق الملف"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header Banner */}
        <div className="text-center space-y-2 border-b border-emerald-900/80 pb-5">
          <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-amber-500/40 text-amber-300 text-xs px-4 py-1.5 rounded-full font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ملف أخبار المنصة الموثق - طبعة 2026 المعتمدة</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-200 pt-1 leading-tight">
            {digest.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {digest.subtitle} • إشراف {digest.author}
          </p>

          {/* Subscriber Code & Status Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-sans">
            <span className="bg-emerald-900/60 border border-emerald-600 text-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>تم تفعيل اشتراكك بالنشرة الروحية!</span>
            </span>
            <span className="bg-slate-900 border border-amber-500/30 text-amber-300 font-mono px-3 py-1 rounded-xl font-extrabold">
              كود العضوية: {subscriberCode}
            </span>
          </div>
        </div>

        {/* Welcome Message Card */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-800/80 p-4 sm:p-5 rounded-2xl space-y-2 relative">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>مرحباً بك في مجتمع النشرة الروحية البريدية</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
            {digest.welcomeMessage}
          </p>
        </div>

        {/* Section 1: Breaking Platform News */}
        <div className="space-y-3 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-emerald-900/60 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2 font-serif">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>أحدث مستجدات وأخبار المنصة الحية (طبعة 2026)</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-mono">
              تحديث مباشر
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
            {digest.breakingNews}
          </p>
        </div>

        {/* Section 2: Featured Articles & Research */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2 font-serif border-b border-slate-800 pb-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>أحدث مقالات وأبحاث كتاب "تأويلات روحية"</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {digest.featuredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 p-3.5 rounded-2xl transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 font-serif leading-snug">
                    {art.title}
                  </h4>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-md shrink-0 font-sans">
                    {art.chapter}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('articles');
                    }}
                    className="text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>قراءة المقال بالكامل</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Spiritual Wisdom of the Day */}
        <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-emerald-950/40 border border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 font-serif">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>نفحة ونور اليوم الروحي</span>
            </h3>
            <span className="text-xs text-slate-400 font-sans">{digest.spiritualWisdom.surah}</span>
          </div>

          <div className="text-center font-serif text-amber-200 text-sm sm:text-base font-bold bg-slate-950/80 p-3 rounded-xl border border-amber-500/20">
            {digest.spiritualWisdom.verse}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-emerald-400 block font-serif">دلالة الكشف والرمز:</strong>
              <p className="text-slate-300 leading-relaxed">{digest.spiritualWisdom.explanation}</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-amber-300 block font-serif">التوجيه الروحي المباشر:</strong>
              <p className="text-slate-300 leading-relaxed">{digest.spiritualWisdom.actionableAdvice}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Live Platform Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-sans">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-amber-300 font-extrabold text-base">{digest.platformStats.totalDreamsInterpreted}</div>
            <div className="text-[10px] text-slate-400 font-serif">تأويل موثق</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-extrabold text-base">{digest.platformStats.verifiedSatisfaction}</div>
            <div className="text-[10px] text-slate-400 font-serif">نسبة التطابق بالواقع</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-amber-300 font-extrabold text-base">{digest.platformStats.activeMembers}</div>
            <div className="text-[10px] text-slate-400 font-serif">عضو مستفيد</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-extrabold text-base">{digest.platformStats.publishedArticles}</div>
            <div className="text-[10px] text-slate-400 font-serif">دراسة ومقال</div>
          </div>
        </div>

        {/* Section 5: Welcome Subscriber Gift Code */}
        <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 font-serif block">
              🎁 {digest.subscriberBonus.title}
            </span>
            <p className="text-xs text-slate-300 font-sans">
              {digest.subscriberBonus.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-slate-950 border border-amber-400 text-amber-300 font-mono font-black text-sm px-3 py-1.5 rounded-xl">
              {digest.subscriberBonus.code}
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Action Buttons Bar (تفعيل الأزرار والخيارات التفاعلية) */}
        <div className="pt-2 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Button 1: Copy Full Text Report */}
            <button
              onClick={handleCopyReport}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                copiedText
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40'
              }`}
            >
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'تم نسخ الملف كاملاً!' : 'نسخ الملف الإخباري'}</span>
            </button>

            {/* Button 2: Print or Download PDF */}
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              title="طباعة أو حفظ الملف كـ PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>طباعة / PDF</span>
            </button>

            {/* Button 3: Share via WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
              title="مشاركة الملف الإخباري عبر الواتساب"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">واتساب</span>
            </button>
          </div>

          {/* Button 4: Navigate to Interpret Dream with Welcome Bonus */}
          {onNavigateTab && (
            <button
              onClick={() => {
                onClose();
                onNavigateTab('ai-interpreter');
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>انتقل لتفسير رؤيتك الآن واستفد من الكود</span>
            </button>
          )}
        </div>

        {/* Footer Guarantee Note */}
        <div className="text-center text-[11px] text-slate-400 font-serif pt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>يصلك هذا الملف الإخباري المتجدد دورياً عبر بريدك الإلكتروني المسجل بشرعية وأمانة تامة.</span>
        </div>

      </div>
    </div>
  );
};
