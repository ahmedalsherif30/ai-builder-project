import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MOCK_ARTICLES } from '../data/mockData';
import { Article } from '../types';
import { ArticleDetailModal } from './ArticleDetailModal';
import { sanitizeMarkdownText } from '../utils/markdownUtils';

interface HomeArticlesStripProps {
  onNavigateToArticles: () => void;
}

export const HomeArticlesStrip: React.FC<HomeArticlesStripProps> = React.memo(({
  onNavigateToArticles,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(MOCK_ARTICLES.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentArticles = MOCK_ARTICLES.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-900/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-700/80 px-3 py-1 rounded-full text-xs text-amber-300 font-serif mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>مقالات ودراسات تعبير الأحلام ({MOCK_ARTICLES.length} مقالاً)</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 font-serif">
            أحدث دراسات ومقالات تأويل الأحلام
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif mt-1 max-w-2xl">
            مقالات علمية وروحانية متخصصة في تفكيك الرموز المنامية ودلالات الأحلام والرؤى الصادقة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Professional Navigation Controls Header */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-emerald-800/80 p-1.5 rounded-2xl shadow-lg">
            <button
              onClick={handlePrevPage}
              title="المقالات السابقة"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-900/60 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-amber-400" />
              <span className="font-serif">السابقة</span>
            </button>


            <button
              onClick={handleNextPage}
              title="المقالات التالية"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-900/60 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95"
            >
              <span className="font-serif">التالية</span>
              <ChevronLeft className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <button
            onClick={onNavigateToArticles}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">جميع المقالات المرجعية ({MOCK_ARTICLES.length})</span>
            <span className="sm:hidden">جميع المقالات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Large Articles Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {currentArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/70 hover:border-amber-400/80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-amber-950/30 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
          >
            {/* Enlarged Image Thumbnail */}
            <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-slate-950">
              <img
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-amber-500/60 text-amber-300 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-serif shadow-lg">
                {article.category}
              </div>

              {/* Read Time */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-950/90 text-slate-200 text-xs sm:text-sm px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-md font-serif">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Content Body - Larger Typography & Spacing */}
            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-serif">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{article.publishedAt}</span>
                  </span>
                </div>

                {/* Title (Enlarged) */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-amber-300 transition-colors font-serif leading-snug line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt (Enlarged) */}
                <p className="text-base sm:text-lg text-slate-300 font-serif leading-relaxed line-clamp-3">
                  {sanitizeMarkdownText(article.excerpt)}
                </p>
              </div>

              {/* Action Button Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm">
                <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1.5 font-serif text-sm sm:text-base">
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
                </span>

                <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 font-serif">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>{article.views} مشاهدة</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSelectArticle={(art) => setSelectedArticle(art)}
          onOpenAiInterpreter={onNavigateToArticles}
        />
      )}
    </section>
  );
});

