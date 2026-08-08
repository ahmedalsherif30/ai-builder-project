import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Sparkles,
  Eye,
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

  // Take 6 featured articles
  const topArticles = MOCK_ARTICLES.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-900/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-950 border border-emerald-700/80 px-3 py-1 rounded-full text-xs text-amber-300 font-serif mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>مقالات ودراسات طبعة 2026 ({MOCK_ARTICLES.length} مقالاً)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 font-serif">
            أحدث دراسات ومقالات تأويل الأحلام
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-serif mt-1 max-w-2xl">
            مقالات علمية وروحانية استناداً إلى قواعد كتاب "تأويلات روحية لفهم المشاهدات المنامية" لـ أحمد الشريف.
          </p>
        </div>

        <button
          onClick={onNavigateToArticles}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer shrink-0"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>تصفح جميع المقالات المرجعية ({MOCK_ARTICLES.length})</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6-Article Prominent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {topArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/70 hover:border-amber-400/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Image Thumbnail */}
            <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/50 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold font-serif shadow-md">
                {article.category}
              </div>

              {/* Read Time */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/90 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-800 shadow-sm font-serif">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-serif">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.publishedAt}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors font-serif leading-snug line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-3">
                  {sanitizeMarkdownText(article.excerpt)}
                </p>
              </div>

              {/* Action Button Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-1 font-serif">
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1 font-serif">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
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
