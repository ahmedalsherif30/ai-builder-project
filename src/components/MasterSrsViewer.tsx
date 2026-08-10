import React, { useState } from 'react';
import { 
  FileText, Download, Copy, Check, Search, Shield, Zap, 
  Sparkles, Layers, Cpu, CreditCard, Lock, Share2, Crown, 
  Compass, ArrowLeft, ChevronDown, BookOpen, Database, Code
} from 'lucide-react';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface MasterSrsViewerProps {
  onNavigateToTab?: (tab: string) => void;
}

export const MasterSrsViewer: React.FC<MasterSrsViewerProps> = ({ onNavigateToTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const fullSrsMarkdown = `# وثيقة المتطلبات الاحترافية لمشروع منصة ExplainingDream.com
**Master Project Specification & SRS Document v2.0 (2026)**

---

## 1. نظرة عامة وتفاصيل المنصة
- **اسم المشروع:** ExplainingDream.com
- **الشعار الرسمي:** تأويلات روحية لفهم المشاهدات المنامية
- **صاحب العلامة والمنهجية:** أحمد الشريف
- **زر التواصل والدعم المباشر:** عبر رابط التحويل الفوري المباشر
- **الحساب الموحد لجميع المنصات:** '@explainingdreams'

---

## 2. الرؤية والأهداف الأستراتيجية
1. **الرؤية:** إنشاء منصة رقمية متكاملة تجمع بين الذكاء الاصطناعي، والخدمات الاحترافية، والمحتوى الموثوق، والتجربة الشخصية للمستخدم، لتكون المرجع الأول عربياً ثم عالمياً في تفسير الأحلام والإرشاد الروحي.
2. **الأهداف:**
   - بناء علامة تجارية شخصية قوية ورائدة باسم أحمد الشريف.
   - تقديم تجربة مستخدم سريعة، سلسة وآمنة تماماً.
   - الاعتماد على الذكاء الاصطناعي المطور وفق منهجية كتاب "تأويلات روحية لفهم المشاهدات المنامية 2026".
   - تحويل الزائر إلى عميل دائم أو مشترك في عضوية VIP.
   - دعم التوسع القادم للتطبيقات الذكية (iOS & Android) واللغات المتعددة.

---

## 3. الهوية البصرية وتجربة المستخدم (UX/UI)
- **الألوان والتصميم:**
  - ألوان هادئة ومريحة (Dark Slate #020617، Emerald #059669، Warm Amber #f59e0b).
  - خطوط عربية أصيلة واضحة (Playfair Display / Plus Jakarta Sans / Tajawal).
  - تصميم Minimalist حديث بدون تشتيت بصري.
  - دعم كامل للوضع الليلي والنهار مع توفر خيارات تخصيص الهوية من لوحة التحكم.
  - حركات انتقالية سلسة وخفيفة للغاية بواسطة CSS / Framer Motion دون أي تأثير على السرعة.

---

## 4. البنية الهيكلية والصفحات الرئيسية
1. **الصفحة الرئيسية (Homepage):**
   - هيدر وتصميم ذكي يحتوي على بانر إعلاني لطبعة كتاب 2026 ورابط الواتساب المباشر.
   - محرك بحث ذكي فوري يغطي الرموز، المقالات، والقرآن.
   - كارت تفاعلي للذكاء الاصطناعي لبدء التفسير الفوري.
   - استعراض أحدث وأكثر المقالات قراءة.
   - عرض تصنيفات موسوعة الأحلام الـ 30.
   - كروت الخدمات المدفوعة (التفسير الكتابي، الصوتي، والجلسة المباشرة) مع كود الخصم \`ALSHERIF2026\`.
   - قسم حجز وكشف طبعة كتاب 2026 الجديدة.
   - قسم عضوية VIP الذهبية مع قائمة المزايا.
   - تقييمات العملاء الموثقة وإحصائيات المنصة المباشرة.
   - قسم الأسئلة الشائعة وتذييل (Footer) كامل الروابط.

2. **محرك الذكاء الاصطناعي (AI Interpreter Engine):**
   - مدرب على كتاب وقواعد أحمد الشريف.
   - يحفظ سياق المحادثة وتاريخ الرؤى السابقة للمستخدم.
   - يوفر إمكانية الحفظ المباشر في "ملف الرؤى الشخصي".
   - يتيح التحويل التلقائي للطلب المدفوع عند الرغبة في تفسير بشري مباشر.
   - يتضمن إخلاء مسؤولية شرعي واضح بأن التفسير اجتهاد وتأنس بالرؤى وليس حكماً قاطعاً.

3. **موسوعة تفسير الأحلام (Dream Encyclopedia):**
   - أكثر من 30 تصنيفاً رئيسياً (الأشخاص، الحيوانات، الذهب، القرآن، الأنبياء، البيوت، السفر، الزواج...).
   - بطاقات تفاعلية مع شرح المعنى الروحي وإمكانية استخدام الرمز فوراً في محرك الذكاء الاصطناعي.

4. **ملف الرؤى الشخصي (Personal Visions Journal):**
   - سجل كامل لكل رؤى المستخدم مع التواريخ والملاحظات ودرجة الشعور/الحالة النفسية.
   - متابعة حالة التفسير وتدوين تحقق الرؤية مستقبلاً.
   - خيارات تصدير السجل بصيغة PDF أو طباعته أو مشاركته مع المفسر.

5. **المكتبة والأدوات:**
   - المصحف الشريف بالرسم العثماني.
   - الأذكار وأدعية اليوم والليلة مع عداد التسبيح الإلكتروني.
   - مواقيت الصلاة واتجاه القبلة واستكشاف أسماء الله الحسنى.
   - حاسبة الزكاة الشرعية لجميع الأموال والأنعام والأنصبة.

6. **قسم الخدمات المدفوعة والعضويات:**
   - طلب تفسير كتابي (توصيل خلال 24 ساعة).
   - طلب تفسير صوتي مباشر بملاحظة أحمد الشريف (خلال 12 ساعة).
   - حجز استشارة وجلسة رؤيا مباشرة (Zoom / WhatsApp Call).
   - اشتراكات VIP الشهرية والسنوية مع أولوية الرد ودورات حصريّة.

---

## 5. استراتيجية تحويل الزائر إلى مشترك (Conversion Funnel)
- **نقاط الجذب والأزرار التفاعلية (CTAs):** وضع أزرار طلب التفسير المباشر في أماكن مدروسة (الهيدر، نتائج الذكاء الاصطناعي، تذييل المقالات).
- **العرض المجاني المحدود:** منح المستخدم تجربة الذكاء الاصطناعي أولاً لإثبات القيمة ثم اقتراح الخدمة الصوتية أو المباشرة عند تعقد الرؤية.
- **إثبات المصداقية (Social Proof):** تقييمات موثقة من عملاء ومكتسبات طبعة 2026.
- **كوبونات الخصم وحوافز الدفع:** استخدام كوبون \`ALSHERIF2026\` بنسبة 20% وربط الدفع برابط التحويل المباشر.
- **برنامج الإحالة:** مكافأة المشتركين برصيد استشارات عند دعوة أصدقائهم.

---

## 6. المواصفات البرمجية والأمان و SEO
- **التقنيات المستخدمة:** React 19 + TypeScript + Vite + Tailwind CSS + Node.js Express.
- **الذكاء الاصطناعي:** Google GenAI SDK (@google/genai) مع Gemini 2.5/Gemini Pro.
- **معايير SEO:**
  - بناء هيكلي متوافق مع Schema.org (Article, WebSite, FAQPage).
  - بطاقات Open Graph و Twitter Cards متكاملة.
  - خريطة الموقع XML و ملف Robots.txt جاهزان.
  - ضغط الصور وتوفير صيغ WebP و Lazy Loading لجميع الوسائط.
  - تحقيق أعلى أداء على اختبارات Google PageSpeed.
- **الأمان والبيانات:**
  - تشفير جميع بيانات المستخدم وحفظ الجلسات بأمان.
  - عدم استخدام مكتبات غير موثوقة.
  - خوادم آمنة مع حماية من الهجمات الموجهة (Firewall & Rate Limiting).

---

## 7. خارطة الطريق المستقبلية (Project Roadmap)
- **المرحلة الأولى (المحققة حالياً):** إطلاق المنصة كاملة بجميع صفحاتها، محرك الذكاء الاصطناعي، الموسوعة، الخدمات المدفوعة، كتاب 2026، ومكتبة الأدوات.
- **المرحلة الثانية:** إطلاق تطبيقات الهاتف الذكي (iOS & Android) بنفس الحساب.
- **المرحلة الثالثة:** إضافة اللغات الأجنبية (الإنجليزية والفرنسية) للتوسع العالمي.
- **المرحلة الرابعة:** إطلاق متجر الكتب المطبوعة والأكاديمية الروحية.
`;

  const sections = [
    { id: 'all', label: 'الوثيقة الكاملة', icon: FileText },
    { id: 'overview', label: '1. نظرة عامة والرؤية', icon: Compass },
    { id: 'design', label: '2. الهوية والتصميم UX', icon: Zap },
    { id: 'architecture', label: '3. صفحات المنصة', icon: Layers },
    { id: 'ai', label: '4. الذكاء الاصطناعي', icon: Cpu },
    { id: 'funnel', label: '5. استراتيجية المبيعات', icon: Sparkles },
    { id: 'services', label: '6. الخدمات والـ VIP', icon: CreditCard },
    { id: 'tech', label: '7. التقنيات والأمان', icon: Code },
    { id: 'roadmap', label: '8. خارطة الطريق', icon: Database },
  ];

  const handleCopySrs = async () => {
    await safeCopyToClipboard(fullSrsMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSrs = () => {
    const blob = new Blob([fullSrsMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ExplainingDream_Master_Specification_SRS_2026.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-emerald-700/50 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Project Specification (SRS v2.0 - 2026)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
              المستند التنفيذي الرئيسي لطلب مشروع منصة <span className="bg-gradient-to-r from-amber-300 via-emerald-200 to-amber-400 bg-clip-text text-transparent">ExplainingDream.com</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              هذه الوثيقة تمثل المخطط الهيكلي والمواصفات الفنية المعتمدة المسلمة لفرق التطوير والذكاء الاصطناعي، وتشتمل على جميع المعايير الاحترافية، خطط التحويل (Conversion Funnel)، قواعد محرك الذكاء الاصطناعي، والهوية البصرية للشيخ أحمد الشريف.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleCopySrs}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 px-4 py-3 rounded-xl text-xs font-semibold transition shadow-lg cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'تم نسخ المستند!' : 'نسخ النص الكامل'}</span>
            </button>

            <button
              onClick={handleDownloadSrs}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-950/60 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف (MD/SRS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث داخل متطلبات المشروع..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            الحالة: <span className="text-emerald-400 font-bold">مستند معتمد وجاهز للتطبيق المباشر</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Spec Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Platform Overview */}
        {(activeSection === 'all' || activeSection === 'overview') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">1. بيانات المنصة والرؤية الرسمية</h3>
                <span className="text-xs text-emerald-400">الرؤية والشعار والأهداف الاستراتيجية</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong className="text-slate-100">اسم المنصة:</strong> ExplainingDream.com</li>
              <li><strong className="text-slate-100">الشعار الرسمي:</strong> تأويلات روحية لفهم المشاهدات المنامية.</li>
              <li><strong className="text-slate-100">المشرف العام:</strong> أحمد الشريف.</li>
              <li><strong className="text-slate-100">زر الدعم والتحويل المباشر:</strong> <span className="text-emerald-400 font-bold">متاح تحويل فوري بضغطة زر</span></li>
              <li><strong className="text-slate-100">الهدف الرئيسي:</strong> إنشاء أول مرجع رقمي رائد يدمج بين الذكاء الاصطناعي والإرشاد الروحي.</li>
            </ul>
          </div>
        )}

        {/* Card 2: Visual Identity & UI */}
        {(activeSection === 'all' || activeSection === 'design') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">2. الهوية البصرية وتجربة المستخدم</h3>
                <span className="text-xs text-amber-400">تصميم Minimalist فاخر وسريع</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>لوحة ألوان متناسقة: الزمردي الراقي (#059669)، الذهبي الملكي (#f59e0b)، والكحلي الداكن (#020617).</li>
              <li>خطوط عربية ملكية فائقة الجودة تضمن سهولة القراءة على كافة الأجهزة.</li>
              <li>سرعة استجابة فائقة متوافقة مع شاشات الهواتف والأجهزة اللوحية والحواسيب.</li>
              <li>تأثيرات حركية ناعمة من Framer Motion لتعزيز الفخامة دون إبطاء التصفح.</li>
            </ul>
          </div>
        )}

        {/* Card 3: AI Engine Rules */}
        {(activeSection === 'all' || activeSection === 'ai') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">3. قواعد محرك الذكاء الاصطناعي</h3>
                <span className="text-xs text-teal-400">منهجية كتاب أحمد الشريف 2026</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>مدرب حصرياً على الرموز الشرعية وقواعد كتاب "تأويلات روحية لفهم المشاهدات المنامية".</li>
              <li>يقدم تحليلاً تفصيلياً (الرموز المزامنة، البعد النفسي، والجانب الروحي).</li>
              <li>يتذكر سياق محادثات المستخدم ويسمح بالحفظ الفوري في ملف الرؤى الشخصي.</li>
              <li>تأكيد دائم على أن التفسير استئناس وليس حكماً قاطعاً أو غيباً مطلقاً.</li>
            </ul>
          </div>
        )}

        {/* Card 4: Conversion Funnel */}
        {(activeSection === 'all' || activeSection === 'funnel') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">4. استراتيجية تحويل الزائر (Funnel)</h3>
                <span className="text-xs text-purple-400">زيادة الاشتراكات ومحركات النمو</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>توزيع أزرار الدعوة للإجراء (CTAs) بتناسق ذكي عبر كافة أجزاء المنصة.</li>
              <li>تقديم تجربة الذكاء الاصطناعي المجانية لتبديد الشكوك وإثبات القيمة الروحية أولاً.</li>
              <li>عرض كوبون الخصم الخاص بمناسبة إطلاق طبعة 2026 (<code className="text-amber-300 font-mono">ALSHERIF2026</code>).</li>
              <li>توفير خيار التحويل والتواصل المباشر السريع عبر زر الواتساب الفوري.</li>
            </ul>
          </div>
        )}

        {/* Card 5: Paid Services & VIP */}
        {(activeSection === 'all' || activeSection === 'services') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">5. الخدمات المدفوعة وعضوية VIP</h3>
                <span className="text-xs text-amber-400">التفسير الكتابي والصوتي والجلسات المباشرة</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong className="text-slate-100">تفسير كتابي سريع:</strong> رد مفصل خلال 24 ساعة بخط يد أحمد الشريف أو المفسرين المعتمدين.</li>
              <li><strong className="text-slate-100">تفسير صوتي خاص:</strong> تسجيل صوتي مباشر مع تحليلات دقيقة خلال 12 ساعة.</li>
              <li><strong className="text-slate-100">جلسة رؤيا استشارية:</strong> مكالمة مباشرة مع أحمد الشريف.</li>
              <li><strong className="text-slate-100">عضوية VIP الذهبية:</strong> أولوية طلقات التفسير، تنزيلات مجانية، ودورات حصرية.</li>
            </ul>
          </div>
        )}

        {/* Card 6: Technical & Security & SEO */}
        {(activeSection === 'all' || activeSection === 'tech') && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-700/50 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-400">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-serif">6. البنية الفنية والـ SEO والأمان</h3>
                <span className="text-xs text-blue-400">أعلى درجات الكفاءة والتوافق</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>تطبيق كامل لمعايير Schema.org لمحركات البحث (SEO Master Integration).</li>
              <li>دعم صور WebP خفيفة للغاية مع ميزة التحميل الكسول (Lazy Loading).</li>
              <li>تشفير البيانات وحماية ضد الهجمات الإلكترونية وسرعة استجابة على Google PageSpeed.</li>
              <li>بنية تحتية كاملة قابلة للتوسع إلى تطبيقات iOS و Android بسهولة.</li>
            </ul>
          </div>
        )}

      </div>

      {/* Interactive Action Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-700/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-100 font-serif">هل تريد تجربة منصة ExplainingDream.com الآن؟</h4>
          <p className="text-xs text-slate-300">جميع هذه المتطلبات مفعلة وتعمل مباشرة عبر الأقسام المختلفة بالمنصة.</p>
        </div>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('ai-interpreter')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            الانتقال للذكاء الاصطناعي
          </button>
        )}
      </div>

    </div>
  );
};
