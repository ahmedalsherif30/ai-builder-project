import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Eye, Feather, Sparkles, Filter, X, ArrowLeft, ChevronRight, Share2, Copy } from 'lucide-react';
import { DREAM_CATEGORIES, ARABIC_LETTERS, MOCK_DREAM_SYMBOLS } from '../data/mockData';
import { DreamSymbol } from '../types';
import { safeCopyToClipboard } from '../utils/copyToClipboard';

interface DreamEncyclopediaProps {
  onSelectSymbolForAi?: (symbolTitle: string) => void;
  initialSearchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const DreamEncyclopedia: React.FC<DreamEncyclopediaProps> = ({
  onSelectSymbolForAi,
  initialSearchQuery = '',
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeModalSymbol, setActiveModalSymbol] = useState<DreamSymbol | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const filteredSymbols = useMemo(() => {
    return MOCK_DREAM_SYMBOLS.filter((item) => {
      // Search check
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMeaning = item.briefMeaning.toLowerCase().includes(q);
        const matchesDetailed = item.detailedInterpretation?.toLowerCase().includes(q);
        const matchesKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMeaning && !matchesDetailed && !matchesKeywords) {
          return false;
        }
      } else {
        // Only apply letter check when not performing a active text search
        if (selectedLetter && item.letter !== selectedLetter) {
          return false;
        }
      }

      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedLetter, searchQuery]);

  const handleCopySymbol = async (sym: DreamSymbol) => {
    const text = `تفسير رمز [${sym.title}] - منصة ExplainingDream.com (أحمد الشريف):\n${sym.detailedInterpretation}\nالشاهد: ${sym.quranicProof || 'لا يوجد'}`;
    await safeCopyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800 text-amber-300 px-3.5 py-1 rounded-full text-xs font-serif">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>موسوعة التفسير الشاملة – أحمد الشريف 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
          دليل ومعجم رموز الأحلام والمشاهدات
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-serif">
          تصفح آلاف الرموز المنامية المصنفة بالحروف الأبجدية والتصنيفات الموضوعية المستخرجة من الكتاب والسنة.
        </p>

        {/* Symbol Context & Personalization Alert Box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-950/90 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-right shadow-lg font-serif">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <span>تنبيه وإرشاد هام في علم التعبير:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                الرمز المنامي ليس قالباً جامداً ثابتاً؛ <strong>فلكل رمز تأويل يختلف كلياً بحسب موقعه الدقيق داخل الرؤيا</strong>، ويمكن أن يتغير التعبير تماماً بحسب <strong>سياق وترتيب باقي الرموز</strong> في الحلم. كما تختلف دلالة الرمز ذاته <strong>من شخص إلى آخر</strong> بحسب حال الرائي، وزمانه، ومكانه، وظروف حياته الشخصية.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن رمز حلم بالكلمات (مثال: ذهب، ثعبان، فستان، مطر، سيارة)..."
            value={searchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="w-full bg-slate-950 border border-emerald-800/80 rounded-xl py-3.5 pr-11 pl-4 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
          <Search className="w-5 h-5 text-emerald-400 absolute right-3.5 top-4" />
          {searchQuery && (
            <button
              onClick={() => handleSearchInputChange('')}
              className="absolute left-3.5 top-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none text-sm">
          {DREAM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-slate-950/80 border-emerald-900 text-slate-200 hover:border-emerald-700 hover:text-amber-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Arabic Alphabet Filter Bar */}
        <div>
          <div className="flex items-center justify-between text-sm text-slate-300 mb-2 font-medium">
            <span>التصفح بالحروف الأبجدية:</span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                إلغاء تحديد الحرف ({selectedLetter})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {ARABIC_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center border ${
                  selectedLetter === letter
                    ? 'bg-emerald-600 text-slate-950 border-emerald-400 shadow-lg'
                    : 'bg-slate-950/90 border-emerald-900/80 text-emerald-200 hover:bg-emerald-900/60 hover:text-amber-300'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Symbol Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>نتائج البحث ({filteredSymbols.length} رمز)</span>
          {(selectedCategory !== 'all' || selectedLetter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLetter(null);
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        {filteredSymbols.length === 0 ? (
          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-8 text-center text-amber-200/90 font-serif space-y-4">
            <p className="text-base sm:text-lg">
              لم نجد رمزاً مطابقاً بدقة لـ <span className="text-amber-400 font-bold">"{searchQuery}"</span> في المعجم السريع.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              يمكنك كتابة الرؤيا كاملة أو طلب تفكيك هذا الرمز فوراً بواسطة مساعد الذكاء الاصطناعي لمنهجية أحمد الشريف.
            </p>
            {onSelectSymbolForAi && searchQuery && (
              <button
                onClick={() => onSelectSymbolForAi(searchQuery)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg cursor-pointer transition"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>تفسير الرمز ({searchQuery}) بالذكاء الاصطناعي الآن</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSymbols.map((sym) => (
              <div
                key={sym.id}
                className="bg-slate-900/80 border border-emerald-900/60 hover:border-amber-400/60 rounded-2xl p-5 space-y-3 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center font-serif">
                      {sym.letter}
                    </span>
                    <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-400" />
                      {sym.viewsCount} مشاهدة
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 font-serif group-hover:text-amber-300 transition">
                    {sym.title}
                  </h3>

                  <p className="text-sm text-slate-200 leading-relaxed font-serif mt-2 line-clamp-3">
                    {sym.briefMeaning}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-emerald-900/40 flex items-center justify-between text-sm">
                  <button
                    onClick={() => setActiveModalSymbol(sym)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>قراءة التعبير الكامل</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {onSelectSymbolForAi && (
                    <button
                      onClick={() => onSelectSymbolForAi(sym.title)}
                      className="text-emerald-300 hover:text-emerald-200 text-xs font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800 cursor-pointer"
                    >
                      تفسير سياقي
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Modal for Symbol */}
      {activeModalSymbol && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setActiveModalSymbol(null)}
              className="absolute top-4 left-4 p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xl flex items-center justify-center font-serif shrink-0">
                {activeModalSymbol.letter}
              </span>
              <div>
                <h3 className="text-2xl font-bold text-slate-100 font-serif">
                  {activeModalSymbol.title}
                </h3>
                <span className="text-sm text-emerald-400 font-serif">
                  من كتاب "تأويلات روحية" طبعة 2026 للشيخ أحمد الشريف
                </span>
              </div>
            </div>

            <div className="bg-slate-950 border border-emerald-900/60 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-amber-400 font-serif">
                ◆ التأويل التفصيلي والمنهجي:
              </h4>
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-serif">
                {activeModalSymbol.detailedInterpretation}
              </p>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/50 p-5 rounded-xl space-y-2">
              <h4 className="text-sm font-bold text-emerald-300 font-serif">
                ✨ البُعد الروحي والإشارة الإلهية:
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-serif">
                {activeModalSymbol.spiritualContext}
              </p>
              {activeModalSymbol.quranicProof && (
                <div className="text-sm text-amber-300 pt-1 font-serif">
                  <b>الشاهد والرمز القرآني:</b> {activeModalSymbol.quranicProof}
                </div>
              )}
            </div>

            {/* Context Note in Modal */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-200/90 font-serif leading-relaxed">
              💡 <strong>قاعدة في التعبير:</strong> قد تختلف دلالة هذا الرمز كلياً بحسب موقعه في الرؤيا وسياق الرموز المرافقة له والحال الشخصي للرائي.
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-900/40">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopySymbol(activeModalSymbol)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>{copied ? 'تم النسخ' : 'نسخ التفسير'}</span>
                </button>
              </div>

              {onSelectSymbolForAi && (
                <button
                  onClick={() => {
                    const title = activeModalSymbol.title;
                    setActiveModalSymbol(null);
                    onSelectSymbolForAi(title);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>فسر حلمك بناءً على هذا الرمز</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
