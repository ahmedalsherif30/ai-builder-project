import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, FileText, Sparkles, HelpCircle, ArrowLeft, Heart } from 'lucide-react';
import { MOCK_DREAM_SYMBOLS } from '../data/mockData';
import { MOCK_ARTICLES } from '../data/mockData';
import { DreamSymbol, Article, PersonalVisionEntry } from '../types';

interface UnifiedGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onSelectSymbol?: (symbol: DreamSymbol) => void;
  onSelectArticle?: (article: Article) => void;
  onNavigateTab?: (tab: string, searchParam?: string) => void;
  userJournalEntries?: PersonalVisionEntry[];
}

export const UnifiedGlobalSearchModal: React.FC<UnifiedGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onSelectSymbol,
  onSelectArticle,
  onNavigateTab,
  userJournalEntries = [],
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'dictionary' | 'articles' | 'journal' | 'faqs'>('all');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search in Dictionary Symbols
  const matchedSymbols = useMemo(() => {
    if (!q) return MOCK_DREAM_SYMBOLS.slice(0, 5);
    return MOCK_DREAM_SYMBOLS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.briefMeaning.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [q]);

  // Search in Articles
  const matchedArticles = useMemo(() => {
    if (!q) return MOCK_ARTICLES.slice(0, 4);
    return MOCK_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [q]);

  // Search in Journal
  const matchedJournal = useMemo(() => {
    if (!q) return userJournalEntries.slice(0, 3);
    return userJournalEntries.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.dreamText.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [q, userJournalEntries]);

  // Search in FAQs
  const matchedFaqs = useMemo(() => {
    const faqList = [
      { q: 'ما الفرق بين التفسير بالذكاء الاصطناعي والاستشارة المباشرة؟', a: 'الذكاء الاصطناعي يقدم تفكيكاً فورياً للرموز بناءً على كتاب أحمد الشريف، بينما الاستشارة تكون تواصل مباشر وتسجيل صوتي من الشيخ.' },
      { q: 'كيف أحفظ أحلامي في الملف الروحي الشخصي؟', a: 'بعد التفسير انقر على زر "حفظ في الملف الشخصي" ليتم تخزينه بأمان في حسابك.' },
      { q: 'هل بياناتي وأحلامي المفسرة مشفرة وآمنة؟', a: 'نعم، نضمن تشفيراً كاملاً وخصوصية تامة لجميع المستخدمين.' },
      { q: 'ما هي طريقة الحصول على رصيد أحلام مجاني إضافي؟', a: 'يمكنك الحصول على رصيد مجاني عبر كود الإحالة ودعوة أصدقائك للانضمام للمنصة.' },
    ];
    if (!q) return faqList;
    return faqList.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [q]);

  const totalResultsCount =
    (activeFilter === 'all' || activeFilter === 'dictionary' ? matchedSymbols.length : 0) +
    (activeFilter === 'all' || activeFilter === 'articles' ? matchedArticles.length : 0) +
    (activeFilter === 'all' || activeFilter === 'journal' ? matchedJournal.length : 0) +
    (activeFilter === 'all' || activeFilter === 'faqs' ? matchedFaqs.length : 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-12 sm:pt-20 animate-fade-in dir-rtl">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Header & Search Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-900/60">
          <div className="flex-1 relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث فورياً في معجم الرموز، المقالات، سجلك الشخصي، والأسئلة الشائعة..."
              className="w-full bg-slate-950 border border-amber-500/50 rounded-2xl py-3 pr-11 pl-10 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition font-serif"
            />
            <Search className="w-5 h-5 text-amber-400 absolute right-3.5 top-3.5" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-slate-950 text-slate-300 hover:text-white rounded-xl border border-emerald-900 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-serif">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'dictionary', label: 'موسوعة الرموز' },
            { id: 'articles', label: 'المقالات والبحوث' },
            { id: 'journal', label: 'سجلك الشخصي' },
            { id: 'faqs', label: 'الأسئلة الشائعة' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap border ${
                activeFilter === f.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 text-slate-300 border-emerald-900 hover:border-emerald-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List Area */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs sm:text-sm font-serif">
          
          {totalResultsCount === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="font-bold text-slate-200">لم نجد نتائج مطابقة للبحث "{query}"</p>
              <p className="text-xs">جرّب البحث باسم رمز آخر مثل: ذهب، ثعبان، مطر، أو كلمة مفتاحية أخرى.</p>
            </div>
          )}

          {/* Dictionary Symbols Results */}
          {(activeFilter === 'all' || activeFilter === 'dictionary') && matchedSymbols.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 px-1">
                <BookOpen className="w-4 h-4" />
                <span>رموز من قاموس الأحلام ({matchedSymbols.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedSymbols.map((sym) => (
                  <div
                    key={sym.id}
                    onClick={() => {
                      if (onSelectSymbol) onSelectSymbol(sym);
                      if (onNavigateTab) onNavigateTab('dictionary', sym.title);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-emerald-900/80 hover:border-amber-400 rounded-xl cursor-pointer transition space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 group-hover:text-amber-300">{sym.title}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                        حرف {sym.letter}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{sym.briefMeaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles Results */}
          {(activeFilter === 'all' || activeFilter === 'articles') && matchedArticles.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 px-1">
                <FileText className="w-4 h-4" />
                <span>المقالات والدراسات التفسيرية ({matchedArticles.length})</span>
              </div>
              <div className="space-y-2">
                {matchedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      if (onSelectArticle) onSelectArticle(art);
                      if (onNavigateTab) onNavigateTab('articles');
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-emerald-900/80 hover:border-amber-400 rounded-xl cursor-pointer transition flex items-start gap-3 group"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="space-y-0.5 flex-1">
                      <h4 className="font-bold text-slate-100 group-hover:text-amber-300 line-clamp-1">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{art.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Journal Results */}
          {(activeFilter === 'all' || activeFilter === 'journal') && matchedJournal.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 px-1">
                <Heart className="w-4 h-4" />
                <span>سجلك الشخصي المحفوظ ({matchedJournal.length})</span>
              </div>
              <div className="space-y-2">
                {matchedJournal.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('journal');
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-amber-500/30 hover:border-amber-400 rounded-xl cursor-pointer transition space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 group-hover:text-amber-300">{entry.title}</span>
                      <span className="text-[10px] text-slate-400">{entry.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{entry.dreamText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Results */}
          {(activeFilter === 'all' || activeFilter === 'faqs') && matchedFaqs.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-1">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>الأسئلة الشائعة</span>
              </div>
              <div className="space-y-2">
                {matchedFaqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <h5 className="font-bold text-amber-300">{faq.q}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>نتائج مباشرة موثوقة من كتاب تأويلات روحية 2026</span>
          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('dictionary', query);
              onClose();
            }}
            className="text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>الانتقال لموسوعة الرموز الكاملة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
