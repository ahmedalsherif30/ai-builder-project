import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Eye,
  ArrowLeft,
  Search,
  User as UserIcon,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { MOCK_ARTICLES } from '../data/mockData';
import { Article, UserProfile } from '../types';
import { ArticleDetailModal } from './ArticleDetailModal';
import { sanitizeMarkdownText } from '../utils/markdownUtils';

interface ArticlesSectionProps {
  user?: UserProfile | null;
  onNavigateToTab?: (tab: string) => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ user, onNavigateToTab }) => {
  const isAdmin = user?.role === 'admin';
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'schedule'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // 365-Day Daily Schedule Engine state
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<number>(1);

  const categories = [
    'الكل',
    'قواعد التعبير',
    'تفسير القرآنيات',
    'البصيرة والروحانيات',
    'أسرار المنام',
    'أحكام شرعية',
    'تقنيات التأمل',
    'علم النفس المنامي',
    'موسوعة الرموز'
  ];

  // Helper to calculate 4 distinct daily articles for any given day (1 to 365)
  const getDailyArticles = (dayNum: number): Article[] => {
    const baseIdx = ((dayNum - 1) * 4) % MOCK_ARTICLES.length;
    const articlesForDay: Article[] = [];
    for (let i = 0; i < 4; i++) {
      const idx = (baseIdx + i) % MOCK_ARTICLES.length;
      articlesForDay.push(MOCK_ARTICLES[idx]);
    }
    return articlesForDay;
  };

  // Filtering articles for 'all' or 'today' tab
  const filteredArticles = MOCK_ARTICLES.filter((art) => {
    // Category match
    if (selectedCategory !== 'الكل' && art.category !== selectedCategory) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = art.title.toLowerCase().includes(q);
      const excerptMatch = art.excerpt.toLowerCase().includes(q);
      const catMatch = art.category.toLowerCase().includes(q);
      if (!titleMatch && !excerptMatch && !catMatch) return false;
    }

    return true;
  });

  // Articles list for rendering
  const articlesToDisplay = activeTab === 'today'
    ? getDailyArticles(1) // Today's 4 articles
    : activeTab === 'schedule'
    ? getDailyArticles(selectedScheduleDay) // Articles for selected scheduled day
    : filteredArticles;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-900/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-700/80 px-3 py-1 rounded-full text-xs text-amber-300 font-serif mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>المرجع المعتمد: منهج "تأويلات روحية" (طبعة 2026) – للباحث والمؤلف أحمد الشريف</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-serif">
                مكتبة المقالات والدراسات التفسيرية
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-serif mt-1">
                دراسات علمية وتأصيل شرعي لمفاهيم وتأويل الرؤى والأحلام استناداً إلى كتاب الله وسنة رسوله ﷺ
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/50 px-4 py-2.5 rounded-2xl text-xs font-mono text-amber-300 shadow-md shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>لوحة الإدارة: محرك SEO والنشر ({MOCK_ARTICLES.length} مقالاً)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-800 px-4 py-2 rounded-2xl text-xs font-serif text-amber-300 shadow-md shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>طبعة 2026 المعتمدة (365 مقالاً)</span>
            </div>
          )}
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-serif text-slate-300">
          <div className="bg-slate-900/80 border border-emerald-900/60 p-4 rounded-2xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">المقالات المرجعية</div>
              <div className="font-bold text-slate-100 text-sm">{MOCK_ARTICLES.length} مقالاً كاملاً وموثقاً</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/60 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">التوثيق العلمي والشرعي</div>
              <div className="font-bold text-amber-300 text-sm">طبعة 2026 أحمد الشريف</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/60 p-4 rounded-2xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">التحديثات والجدول اليومي</div>
              <div className="font-bold text-slate-100 text-sm">4 مقالات مختارة يومياً</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/60 p-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">القواعد والتأصيل</div>
              <div className="font-bold text-emerald-300 text-sm">ضوابط تعبير المشاهدات</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>مكتبة المقالات والدراسات ({MOCK_ARTICLES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>مقالات اليوم المختارة (4 مقالات)</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-slate-900 text-slate-300 border border-emerald-900 hover:border-emerald-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>جدول القراءة اليومي (365 يوماً)</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              placeholder="ابحث بالكلمات المفتاحية والفصول والرموز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-emerald-800 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4.5 h-4.5 text-emerald-400 absolute right-3.5 top-3" />
          </div>

        </div>

        {/* Category Filters for 'all' tab */}
        {activeTab === 'all' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-amber-300 border border-amber-500/50 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-emerald-950 hover:border-emerald-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Selector Bar if activeTab === 'schedule' */}
      {activeTab === 'schedule' && (
        <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-amber-300 font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>فهرس القراءة والجدول اليومي (4 مقالات متنوعة لكل يوم من أيام السنة)</span>
              </h3>
              <p className="text-xs text-slate-300 font-serif mt-1">
                اختر اليوم من السنة (اليوم 1 إلى 365) لاستعراض المقالات الأربعة المخصصة للقراءة في ذلك اليوم.
              </p>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex items-center gap-2 bg-slate-950 border border-emerald-900 p-1.5 rounded-2xl">
              <button
                onClick={() => setSelectedScheduleDay((d) => Math.max(1, d - 1))}
                disabled={selectedScheduleDay <= 1}
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <span className="text-xs font-bold text-amber-300 px-3 font-mono">
                اليوم {selectedScheduleDay} من 365
              </span>

              <button
                onClick={() => setSelectedScheduleDay((d) => Math.min(365, d + 1))}
                disabled={selectedScheduleDay >= 365}
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[1, 15, 30, 60, 90, 120, 180, 240, 300, 365].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedScheduleDay(day)}
                className={`py-2 px-3 rounded-xl text-xs font-serif transition cursor-pointer border ${
                  selectedScheduleDay === day
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-950 text-slate-300 border border-emerald-900 hover:border-emerald-700'
                }`}
              >
                اليوم {day} (4 مقالات)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesToDisplay.slice(0, activeTab === 'all' ? visibleCount : articlesToDisplay.length).map((art) => (
          <div
            key={art.id}
            onClick={() => {
              setSelectedArticle(art);
            }}
            className="bg-slate-900/90 border border-emerald-900/60 hover:border-amber-400/60 rounded-3xl overflow-hidden shadow-2xl transition duration-300 cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="h-60 sm:h-64 overflow-hidden relative">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
                <span className="absolute top-4 right-4 bg-slate-950/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl font-serif font-bold shadow-md">
                  {art.category}
                </span>

                <span className="absolute bottom-4 left-4 bg-slate-950/90 border border-emerald-700 text-emerald-300 text-xs px-3 py-1 rounded-md font-serif flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> موثق
                </span>
              </div>

              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-300 font-serif">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <UserIcon className="w-4 h-4" /> {art.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-400" /> {art.readTime}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-xs text-slate-400">{art.publishedAt}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-serif group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 font-serif line-clamp-3 leading-relaxed">
                  {sanitizeMarkdownText(art.excerpt)}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs text-amber-400 font-bold border-t border-emerald-900/30">
              <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition">
                اقرأ المقال الشامل بالتفصيل <ArrowLeft className="w-4 h-4" />
              </span>
              <span className="text-slate-500 text-[11px] font-normal flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> {art.views} قراءة
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button for 'all' tab */}
      {activeTab === 'all' && filteredArticles.length > visibleCount && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="px-10 py-4 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 hover:from-emerald-800 hover:to-slate-800 text-amber-300 border border-emerald-700/80 rounded-2xl text-xs sm:text-sm font-bold font-serif transition cursor-pointer shadow-xl inline-flex items-center gap-2.5"
          >
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>عرض المزيد من المقالات المرجعية ({filteredArticles.length - visibleCount} مقالة متبقية)</span>
          </button>
        </div>
      )}

      {/* Comprehensive Professional Reader & SEO Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSelectArticle={(art) => setSelectedArticle(art)}
          onOpenAiInterpreter={() => {
            if (onNavigateToTab) onNavigateToTab('home');
          }}
          onOpenPrivateConsultation={() => {
            if (onNavigateToTab) onNavigateToTab('services');
          }}
          onOpenVipInfo={() => {
            if (onNavigateToTab) onNavigateToTab('vip');
          }}
          isAdmin={isAdmin}
        />
      )}

    </div>
  );
};
